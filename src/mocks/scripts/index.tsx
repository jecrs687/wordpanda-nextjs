const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getPerf = () => window.performance || window.mozPerformance
    || window.msPerformance || window.webkitPerformance;
const getAllSubtitles = async ({
    className, openAll
}) => {
    await sleep(1000);
    if (!document.getElementsByClassName(className).length) {
        const list = document.getElementsByClassName(openAll)
        if (!list?.length) return getAllSubtitles({
            className, openAll
        })
        Array(...list).forEach((x) => {
            x.click()
        })
        await sleep(1000);
    }
    const checkeds = [...document.getElementsByClassName(className)].map(x => x.children[0].checked)
    const allSubtitles = document.getElementsByClassName(className)
    if (!allSubtitles?.length)
        return getAllSubtitles({
            className, openAll
        })
    for (const x of Array(...allSubtitles)) {
        x.click();
        sleep(100);
    }
    console.log({ allSubtitles })
    await sleep(3000);
    Array(...allSubtitles).forEach((x, index) => {
        if (checkeds[index])
            x.click()
    })
    var performance = getPerf()
    const values = performance.getEntries().map((value) => value?.name?.split('.')).filter((v) => v.includes('ttml2')).map((v) => v.join("."))
    console.log({ values })
    if (!values?.length)
        return getAllSubtitles({
            className, openAll
        })
    return values;
}


getAllSubtitles({
    openAll: "fqye4e3 f1ly7q5u fk9c3ap fz9ydgy f1xrlb00 f1hy0e6n fgbpje3 f1uteees f1h2a8xb f760yrh f1mic5r1 f13ipev8 atvwebplayersdk-subtitleaudiomenu-button f1a9wsg7 f15v4vpu frcngjs f12ossvl f45h",
    className: 'f15n26ui f1yahgwu fk7dnjf atvwebplayersdk-subtitleoption-container f11d1lkh'
}).then(x => console.log({
    name: document.getElementsByClassName("atvwebplayersdk-title-text fgzdi7m f17cfskt f1vw7pit")[0].innerText,
    links: x,
    image: document.getElementsByClassName("Ah1hNY")[0].src,
    platform: "Prime Video"
}))