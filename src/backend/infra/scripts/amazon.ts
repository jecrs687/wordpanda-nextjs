import { getCatalogAmazon } from "@infra/clients/amazon/getCatalog"




export const amazonCatalog = async () => {
    const response = await getCatalogAmazon(
        `session-id=139-3438023-6442448; i18n-prefs=USD; ubid-main-av=131-5335392-2487807; lc-main-av=pt_BR; x-main-av=HKVXHbsmFaiH8txrYlDK363Lm4zIDkKiXMn7nCUvmdLHXfNKubgNFJ6Xmj8Y1BKV; at-main-av=Atza|IwEBIK0M5a-Y8Usytxx2fx3dLPloQSOEJ2CB4szluqNG0jn4lnh-iKoXyx6aIOLM5OtZILbt7U2m-7wc_hlHiUuUri5alwmqVvhkccDnKnmuYOlZSWmjBXTa3iiFIP3FAiBoZ9TT3GqDb0bMPnN7jdoeSZGHDSJTCAtqoovGq15kvhFE1Xl4UfpDW_W4-NyDov8bIHa71Eeo5LngssB8Ly07IoBT3bdbsxtZuu5twjPaFRVRmGgUSctmPnjHup5ofjZLS9A; sess-at-main-av="Kgpzj3VjAd0mefj3mPdSL//pS9NRcmcxLF9CXiHxzf0="; session-id-time=2082787201l; av-timezone=Europe/Rome; av-profile=cGlkPWFtem4xLmFjdG9yLnBlcnNvbi5vaWQuQTM2M1dTRjZPOThUNyZ0aW1lc3RhbXA9MTcyMTExNjg0MjQ0NSZ2ZXJzaW9uPXYx.g9iz-Xq1_SC0C2MuJpJOJ-brBdu2kDeXdGaxGbO5F-omAAAAAQAAAABmliiqcmF3AAAAAPgWC9WfHH8iB-olH_E9xQ; 93d9d748e70f1529aec5c6ac452d563c=fdbbeb6ae6bc74bbd9ae01d30055979a; csm-hit=tb:9EZX8D64C6MEQVFMW2ZC+s-TZS5E2A6HGJFW9GRR45V|1721333408657&t:1721333408657&adb:adblk_yes; session-token="eYKAH9m+t+WKdOCw1gQHf93X4myA4s8xC/2tAuk9tB8vm+azq6ouoUYge8RnXoQFs7WivDLzhMUILoieToEpX5bvcg4IhjaiPbEAKjMiSQ4UZlS8365E7UnH11QYQTmCnn9uR77xb3NvuunyXNQKnVkPqXgDByUhXTTYMTGDjGrEOSBnIyEYVYM+L0wFfH4dXeQUnwmqIxAPDP42iy3vciTEEaMxPKLtKwaY6R2AYKrC9OfOQOez6F4SxitBj+wH9gb+FEGS1lR440auOmdC9KcoyMGxhuw26GcpkuZj1BWGQnGkPe49SVzfsWwnLl5PF81CvQ6j5IL0fXn0/TpYarVjDyx0pbuRpQgJD6PVHkk8NLPKL8VDO8tgwcWEFzc3d6DYf4NWh84=`
    )
    console.log(response)
}


amazonCatalog()