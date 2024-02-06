export function useChannels() {
    if (typeof window === 'undefined') return {}
    const channel = window as any
    return {
        mobile: {
            sharing: (...values) => channel?.ReactNativeWebView?.postMessage(
                JSON.stringify({
                    name: 'sharing',
                    content: values

                }), '*'),
            linking: (...values) => channel?.ReactNativeWebView?.postMessage(
                JSON.stringify({
                    name: 'linking',
                    content: values
                }), '*'),
            vibration: (...values) => channel?.ReactNativeWebView?.postMessage(
                JSON.stringify({
                    name: 'vibration',
                    content: values
                }), '*'),
        },
        web: {
            setToken: (token) => window?.parent?.postMessage(
                {
                    name: 'setToken',
                    content: token
                }, '*'),
            sendWords: () => window?.parent?.postMessage(
                {
                    name: 'sendWords',
                }, '*'),
            sendList: () => window?.parent?.postMessage(
                {
                    name: 'sendList',
                }, '*'),
            closeModal: () => window?.parent?.postMessage(
                {
                    name: 'closeModal',
                }, '*'),
            openModal: () => window?.parent?.postMessage(
                {
                    name: 'openModal',
                }, '*'),
            style_modal: (style) => parent?.postMessage(
                {
                    name: 'style_modal',
                    content: style
                }, '*'),
            setCookie: ({ name, value, days }) => window?.parent?.postMessage(
                {
                    name: 'setCookie',
                    content: { name, value, days }
                }, '*'),
            deleteCookie: (name) => window?.parent?.postMessage(
                {
                    name: 'deleteCookie',
                    content: name
                }, '*'),
            video_control: (action, value) => {
                window?.parent?.postMessage(
                    {
                        name: 'video_control',
                        content: { action, value }
                    }, '*')
            },
            test: () => {
                parent[0]?.postMessage({
                    data: {
                        name: 'test',
                    }
                }, '*')
                parent?.postMessage({
                    data: {
                        name: 'test',
                    }
                }, '*')
                window?.parent?.parent?.postMessage(
                    {
                        data: {
                            name: 'test',
                        }
                    }, '*')
            }


        },
        popUp: {
            video_control: (action, value) => {
                window?.parent?.postMessage(
                    {
                        name: 'video_control',
                        content: { action, value }
                    }, '*')
            },
            setToken: (token) => window?.parent?.postMessage(
                {
                    name: 'setToken',
                    content: token
                }, '*'),
            setLocalStorage: (name, value) => window?.parent?.postMessage(
                {
                    name: 'setLocalStorage',
                    content: { [name]: value }
                }, '*'),
            getLocalStorage: (name) => window?.parent?.postMessage(
                {
                    name: 'getLocalStorage',
                    content: [name]
                }, '*'),

        }
    };
}