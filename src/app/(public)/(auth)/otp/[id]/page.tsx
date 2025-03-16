import OtpConfirmation from './_container/OTP';

export default async function Page(props) {
    const params = await props.params;

    const {
        id
    } = params;

    return (
        <OtpConfirmation id={id}/>
    )
}
