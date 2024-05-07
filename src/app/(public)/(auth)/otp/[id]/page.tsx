import OtpConfirmation from './_container/OTP';

export default async function Page({
        params: { id }
}) {
    return (
        <OtpConfirmation id={id}/>
    )
}
