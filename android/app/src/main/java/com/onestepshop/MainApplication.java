package com.onestepshop;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.remobile.splashscreen.RCTSplashScreenPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.InterstitialAd;

public class MainApplication extends Application implements ReactApplication {

  private InterstitialAd mInterstitialAd;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNAdMobPackage(),
            new ImagePickerPackage(),
            new RNGeocoderPackage(),
            new VectorIconsPackage(),
            new RCTSplashScreenPackage(MainActivity.activity, true)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    MobileAds.initialize(this, "ca-app-pub-3670807734353712~6567535677");
    mInterstitialAd = new InterstitialAd(this);
    mInterstitialAd.setAdUnitId("ca-app-pub-3670807734353712/7131051573");
//    mInterstitialAd.setTestDeviceID("EMULATOR");

  }
}
