<template>
  <div class="mx-auto overflow-visible" style="max-width: 868px">
    <div class="container container-fluid">
      <h2>Google Analytics</h2>
      <div class="row mt-2">
        <div class="col-1"></div>
        <textarea class="col-10" v-model="textAreaText" readonly style="background-color: #e5e5e5; min-height: 300px"></textarea>
      </div>
      <v-form ref="form" lazy-validation>
        <div class="row justify-content-center mt-3">
          <div class="col-2"></div>
          <div class="col-3">
            <v-select
              v-model="dimension"
              :items="dimensions"
              label="Dimension"
              dense
            >
            </v-select>
          </div>
          <div class="col-3">
            <v-select
              v-model="metric"
              :items="metrics"
              label="Metric"
              dense
            >
            </v-select>
          </div>
          <div class="col-1">
            <v-btn
              :disabled="searching"
              color="success"
              class="mr-4"
              @click="startSearch()"
            >
              Search
            </v-btn>
          </div>
        </div>
        <div class="row">
        </div>
      </v-form>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import errorParser from "@/lib/errorParser";

export default {
  data() {
    return {
      textAreaText: '',
      searching: false,
      dimension: '',
      metric: '',
      dimensions: ['','achievementId','adFormat','adSourceName','adUnitName','appVersion','audienceId','audienceName','brandingInterest','browser','campaignId','campaignName','character','city','cityId','cohort','cohortNthDay','cohortNthMonth','cohortNthWeek','contentGroup','contentId','contentType','country','countryId','date','dateHour','dateHourMinute','day','dayOfWeek','defaultChannelGrouping','deviceCategory','deviceModel','eventName','fileExtension','fileName','firstSessionDate','firstUserMedium','firstUserSource','firstUserSourcePlatform','fullPageUrl','groupId','hostName','hour','landingPage','language','languageCode','linkClasses','linkDomain','linkId','linkText','linkUrl','medium','method','minute','mobileDeviceBranding','mobileDeviceMarketingName','mobileDeviceModel','month','newVsReturning','nthDay','nthHour','nthMinute','nthMonth','nthWeek','nthYear','operatingSystem','operatingSystemVersion','operatingSystemWithVersion','outbound','pageLocation','pagePath','pagePathPlusQueryString','pageReferrer','pageTitle','percentScrolled','platform','platformDeviceCategory','region','screenResolution','searchTerm','sessionCampaignId','sessionCampaignName','sessionMedium','sessionSource','sessionSourcePlatform','source','sourcePlatform','streamId','streamName','testDataFilterName','transactionId','userAgeBracket','userGender','week','year'],
      metrics: ['active1DayUsers','active28DayUsers','active7DayUsers','activeUsers','adUnitExposure','addToCarts','averagePurchaseRevenue','averagePurchaseRevenuePerPayingUser','averagePurchaseRevenuePerUser','averageRevenuePerUser','averageSessionDuration','cartToViewRate','checkouts','cohortActiveUsers','cohortTotalUsers'	,'conversions','crashAffectedUsers','crashFreeUsersRate','dauPerMau','dauPerWau','ecommercePurchases','engagedSessions','engagementRate','eventCount','eventCountPerUser','eventValue','eventsPerSession','firstTimePurchaserConversionRate','firstTimePurchasers','firstTimePurchasersPerNewUser','itemListClickThroughRate','itemListClicks','itemListViews','itemPromotionClickThroughRate','itemPromotionClicks','itemPromotionViews','itemPurchaseQuantity','itemRevenue','itemViews','newUsers','publisherAdClicks','publisherAdImpressions','purchaseRevenue','purchaseToViewRate','purchaserConversionRate','screenPageViews','screenPageViewsPerSession','sessions','sessionsPerUser','totalAdRevenue','totalPurchasers','totalRevenue','totalUsers','transactions','transactionsPerPurchaser','userEngagementDuration','wauPerMau']
    }
  },
  methods: {
    async startSearch() {
      if (this.searching) return false
      this.searching = true;
      try {
        const { data } = await axios.get(`public/stats/`, { params: { dimension:  this.dimension, metric: this.metric }, } );
        console.log(data)
        this.textAreaText = data;
      } catch (error) {
        console.log(errorParser(error))
        this.textAreaText = errorParser(error);
      }
      this.searching = false;


    }
  }
}
</script>

<style>

</style>