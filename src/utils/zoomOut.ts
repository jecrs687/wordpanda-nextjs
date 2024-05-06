export const zoomOutMobile = () => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    viewportMeta?.setAttribute('content', 'initial-scale=1');
    viewportMeta?.setAttribute('content', 'width=device-width');
}
