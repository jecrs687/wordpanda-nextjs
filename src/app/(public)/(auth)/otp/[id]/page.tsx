import OtpConfirmation from './_container/Register';

export default async function Page({
        params: { id }
}) {
    return (
        <OtpConfirmation id={id}/>
    )
}
