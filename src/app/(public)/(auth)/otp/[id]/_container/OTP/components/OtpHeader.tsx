import Image from 'next/image';

export default function OtpHeader() {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-28 h-28 md:w-36 md:h-36">
                <Image
                    src="/assets/logo.png"
                    alt="WordPanda Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    Verificação
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                    Enviamos um código de verificação para o seu email
                </p>
            </div>
        </div>
    );
}
