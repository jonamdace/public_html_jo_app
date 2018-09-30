package com.onestepshop;

import com.facebook.react.ReactActivity;

import android.app.Activity;

public class MainActivity extends ReactActivity {

    public static Activity activity;           // <------ add here

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {

        activity = this;           // <------ add here

        return "OneStepShop";
    }
}
