import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { extractPathFromURL } from '@/utils/string';
import { stateManager, store } from '@/components/singletons';
import { StoreKey, SwitchState } from '@/types/enum';
import { ReviewBaseInfo, ReviewDetail } from '@/types/reviews';
import { getCronJobIds, save } from '@/pages/cronjob/request';

puppeteer.use(StealthPlugin());



const createCronjob = async () => {
  const idList = await getCronJobIds()
  let nextId: number | undefined;
  let globalMap: Record<string, string> = {}
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--window-size=1920,1080',
      '--disable-infobars',
      '--enable-webgl',
      '--ignore-gpu-blacklist',
      '--disable-features=WebRtcHideLocalIpsWithMdns'
    ],
  });
  stateManager.setSpiderWindow(browser);

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 }); // 设置视图大小
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
  );
  await page.goto(`https://hotels.ctrip.com/hotels/detail/?hotelId=${idList.shift()}`, {
    waitUntil: 'networkidle2' // 等待网络空闲时再进行下一步操作
  });

  const navigateToNextPage = async () => {
    while (store.get(StoreKey.SWITCH) === SwitchState.PAUSED) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await page.waitForTimeout(store.get(StoreKey.WAIT_TIME)* 1000);
    globalMap = {}
    if (idList.length === 0) {
      const NewIdList = await getCronJobIds(); // Replenish the idList
      idList.push(...NewIdList);
    }
    nextId = idList.shift(); // Get the next ID
    if (nextId) {
      await page.goto(`https://hotels.ctrip.com/hotels/detail/?hotelId=${nextId}`, {
        waitUntil: 'networkidle2'
      });
    }
  };

  page.on('response', async response => {
    if (extractPathFromURL(response.url()).includes("code=norank")){
      const reviewBaseInfo: ReviewBaseInfo = {
        hotel_id: Number(nextId),
      }
      await save(reviewBaseInfo)
      await navigateToNextPage();
    }
    if (extractPathFromURL(response.url()).includes('GetReviewList')) {
      const data = await response.json();
      if (data?.Response && Object.keys(data.Response).length > 0)  {
        const BaseInfo = data?.Response?.ReviewBaseInfo;
        const reviewFilterList = data?.Response?.ReviewFilterList;
        const reviewList = data?.Response?.ReviewList || [];
        const unusefulReviewList = data?.Response?.UnusefulReviewList
        if (reviewFilterList?.length && reviewFilterList?.find((v: any) => v.id === '3')) {
          globalMap['recommended_review'] = reviewFilterList?.find((v: any) => v.id === '2')?.count || '0'
          globalMap['bad_review'] = reviewFilterList?.find((v: any) => v.id === '3')?.count || '0'
          let clicked = false; // 标志是否已点击
          const startTime = Date.now(); // 记录开始时间
          while (!clicked && Date.now() - startTime < 20000) { // 20秒超时
            const buttons = await page.$x("//button/span[contains(text(), '差评')]/..") as any;
            if (buttons && buttons.length > 0) {
              await buttons[0].click();
              clicked = true; // 已点击，退出循环
            } else {
              await page.waitForTimeout(500); // 等待1秒
            }
          }
        }else if (reviewFilterList?.length === 0 ||  (reviewFilterList?.length && !reviewFilterList?.find((v: any) => v.id === '3'))){
          const reviewBaseInfo: ReviewBaseInfo = {
            hotel_id: Number(nextId),
            total_review: BaseInfo?.ctripTotalReviews,
            recommended_review: Number.parseInt(globalMap['recommended_review'], 10) || 0,
            bad_review: Number.parseInt(globalMap['bad_review'], 10) || 0,
            environment: BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '环境')[0]?.itemScore,
            hygiene:  BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '卫生')[0]?.itemScore,
            service:  BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '服务')[0]?.itemScore,
            facility: BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '设施')[0]?.itemScore,
            score: BaseInfo?.score,
          }
          await save(reviewBaseInfo)
          await navigateToNextPage();
        }
        if (!reviewFilterList && (reviewList?.length > 0 ||unusefulReviewList?.length > 0)) {
          if (unusefulReviewList?.length > 0){
              reviewList.push(...unusefulReviewList)
          }
          const reviewBaseInfo: ReviewBaseInfo = {
            hotel_id: Number(nextId),
            total_review: BaseInfo?.ctripTotalReviews,
            recommended_review: Number.parseInt(globalMap['recommended_review'], 10) || 0,
            bad_review: Number.parseInt(globalMap['bad_review'], 10) || 0,
            environment: BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '环境')[0]?.itemScore,
            hygiene:  BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '卫生')[0]?.itemScore,
            service:  BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '服务')[0]?.itemScore,
            facility: BaseInfo?.categoryScore?.filter((v:any) => v?.scoreName === '设施')[0]?.itemScore,
            score: BaseInfo?.score,
          }
          const reviewDetailList: ReviewDetail[] = reviewList.map((v:any) => ({hotel_id: Number(nextId), review_id: v.reviewId, score: v?.reviewDetails?.reviewScore?.score, review_content: v?.reviewDetails?.reviewContent, release_date: v?.reviewDetails?.releaseDate, checkIn_date:  v?.reviewDetails?.checkInDate }))
          const response = await save(reviewBaseInfo, reviewDetailList)
          if (response) {
            console.log(`保存成功：${nextId}`);
          }else {
            console.log(`保存失败：${nextId}`);
          }
          await navigateToNextPage();
        }
      }
    }
  });
  await navigateToNextPage();
}

export default createCronjob;
