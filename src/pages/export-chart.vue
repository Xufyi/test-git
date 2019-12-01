<template>
  <div class="iqis-guide">
    <div class="guide-banner-box">
        <img class="guide-banner-img" src="../assets/img/banner.png" width="1280" height="320" alt="">
        <div class="guide-banner-text guide-container">
          <h1 class="guide-logo"><img src="../assets/img/logo.png" alt=""></h1>
          <h2 class="guide-h2">新 手 指 南</h2>
          <p class="clearfix guide-p">
            <span class="pull-left">发布版本</span>
            <span class="pull-right">V1.0</span>
          </p>
        </div>
    </div>
    <div class="guide-content-box guide-container">
      <ul class="clearfix">
        <li>
          <!-- <h3>Step1</h3> -->
          <img style="display:inline-block;" src="../assets/img/step1.png" alt="">
          <h4>设置角色权限</h4>
          <p>系统设置 → 权限管理 → 添加（完成角色创建）→ 点击权限修改（给刚刚创建的角色配置权限）</p>
        </li>
        <li>
          <img class="next" src="../assets/img/next.png" alt="">
        </li>
        <li>
          <!-- <h3>Step2</h3> -->
          <img style="display:inline-block;" src="../assets/img/step2.png" alt="">          
          <h4>添加部门和用户</h4>
          <p>系统设置 → 用户信息 → 部门栏中点“添加子级”（完成部门创建）→ 点添加（完成用户创建） </p>
        </li>
        <li>
          <img class="next" src="../assets/img/next.png" alt="">
        </li>
        <li>
          <!-- <h3>Step3</h3> -->
          <img style="display:inline-block;" src="../assets/img/step3.png" alt="">                    
          <h4>添加设备资料</h4>
          <p>设备管理 → 设备台账 → 设备类别栏中点“添加子级”（完成设备类别创建）→ 点添加（完成设备创建）</p>
        </li>

        <li>
          <!-- <h3>Step4</h3> -->
          <img style="display:inline-block;" src="../assets/img/step4.png" alt="">                    
          <h4>完善质量规划</h4>
          <p>质量规划 →（创建完善二级菜单和三级菜单下所有的基础数据</p>
        </li>
        <li>
          <img class="next" src="../assets/img/next.png" alt="">
        </li>
        <li>
          <!-- <h3>Step5</h3> -->
          <img style="display:inline-block;" src="../assets/img/step5.png" alt="">                    
          <h4>添加产品资料</h4>
          <p>产品资料 → 产品库 → 产品类别栏中点“添加子级”（完成产品类别创建）→ 点添加（根据需要勾选产品所需的检验环节，并完善信息）</p>
        </li>
        <li>
          <img class="next" src="../assets/img/next.png" alt="">
        </li>
        <li>
          <!-- <h3>Step6</h3> -->
          <img style="display:inline-block;" src="../assets/img/step6.png" alt="">                    
          <h4>添加供应商</h4>
          <p>来料控制 → 供应商管理 → 供应商类别栏中点“添加子级”（完成供应商类别创建）→ 点添加（完成供应商创建）</p>
        </li>

        <li>
          <!-- <h3>Step7</h3> -->
          <img style="display:inline-block;" src="../assets/img/step7.png" alt="">                    
          <h4>添加客户信息</h4>
          <p>客服中心 → 客户列表 → 客户类别栏中点“添加子级”（完成客户类别创建）→ 点添加（完成客户创建）</p>
        </li>
        <li>
          <img class="next" src="../assets/img/next.png" alt="">
        </li>
        <li>
          <!-- <h3>Step8</h3> -->
          <img style="display:inline-block;" src="../assets/img/step8.png" alt="">                    
          <h4>添加生产批次</h4>
          <p>过程控制 → 生产批次 → 点添加（完成生产批次创建）</p>
        </li>
        <li>
          <img class="next" src="../assets/img/next.png" alt="">
        </li>
        <li>
          <!-- <h3>Step9</h3> -->
          <img style="display:inline-block;" src="../assets/img/step9.png" alt="">                    
          <h4>开始作业</h4>
          <p>可以录入检验数据，异常单数据等等；</p>
        </li>
      </ul>
    </div>
    <div class="guide-footer-box">
      <div class="guide-container clearfix">
        <div class="pull-left block">
          <p style="margin-top:12px;margin-bottom:30px;">深圳市矢分科技有限公司</p>
          <p style="margin-bottom:15px;">24h客服热线：15768878423</p>
          <p>客服邮箱：wuqc@wuqc.cn</p>
        </div>
        <div class="pull-left block">
          <p style="margin-top:56px;margin-bottom:15px;">官方网址：www.wuqc.cn</p>
          <p>公司地址：深圳南山区大学城创客小镇17栋一楼</p>
        </div>
        <div class="pull-left block">
          <img style="margin-right:10px;" class="pull-left" src="../assets/img/code.png" alt="">
          <div class="pull-left">
            <p style="margin-top:61px;margin-bottom:15px;">扫描二维码</p>
            <p>关注官方微信</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
<style>
.iqis-guide *{margin:0;padding:0;}
.guide-container{width:980px;margin:0 auto;}
.pull-left{float: left;}
.pull-right{float: right;}
.guide-banner-box{position:relative;background:#053574;height: 320px;}
.guide-banner-img,.guide-banner-text{position: absolute;top:0;left:50%;transform: translate(-50%,0);}
.guide-logo{padding-top:20px;}
.guide-h2{height:64px;text-align: center;font-size:64px;font-family:AdobeHeitiStd-Regular;color:rgba(255,255,255,1);line-height:64px;font-weight: normal;margin-top: 30px;}
.guide-p{color:#fff;width:160px;margin:40px auto 0 auto;padding:0 20px;height:48px;border-radius:2px;border:1px solid rgba(80,227,194,1);text-align: center;line-height: 48px;font-size: 16px;}
.clearfix:after{clear: both;content:'';height:0;visibility: hidden;display: block;}
.guide-content-box li{position:relative;float: left;width:220px;list-style: none;margin-top:60px;height:270px;text-align:center;font-weight:normal;}
.guide-content-box li:nth-child(5n+2),.guide-content-box li:nth-child(5n+4){width:160px;list-style: none;}
.guide-content-box li h3{font-weight:normal;font-size:30px;font-family:AgencyFB-Bold;color:rgba(65,143,238,1);}
.guide-content-box li h4{font-weight:normal;font-size:24px;font-family:AdobeHeitiStd-Regular;color:rgba(65,143,238,1);margin:10px 0 16px 0}
.guide-content-box li P{font-size:18px;font-family:AdobeHeitiStd-Regular;color:rgba(130,130,131,1);line-height:24px;}
.guide-content-box li .next{position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);opacity: .24;}
.guide-footer-box{background:#F2F3F5;height:138px;padding-top: 15px;padding-bottom:13px;font-size:14px;color:#454647;font-family:MicrosoftYaHei;line-height:14px;}
.guide-footer-box .block{margin-right:145px;}
.guide-footer-box .block:last-child{float: right;margin-right: 0;color:#4A90E2}
</style>

