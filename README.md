## Prompt for new components:

Create a sleek, visually captivating, and highly modern UI for 'WordPanda,' a next-generation language-learning application that blends immersive exercises, gamified progress tracking, and interactive challenges into a seamless experience. The design must feel premium, engaging, and intuitive, with a perfect balance of elegance and playfulness, ensuring high contrast and aesthetic appeal in both light and dark modes. The color palette should evoke the panda theme while incorporating the stylish vibrancy of cutting-edge learning platforms. 

For dark mode, use a deep, luxurious background gradient transitioning from black to gray-950, enriched with hints of blue-950 and emerald-950 for depth. Text should be crisp white for maximum readability, with secondary text in zinc-300 to maintain contrast without strain. Cards and interactive elements should have a glass-like, semi-transparent effect with a backdrop blur, creating a smooth, immersive visual experience. For light mode, the background should be a soft, elegant white with subtle gradient overlays of zinc-100 and sky-50, preventing a flat appearance while keeping the interface clean and fresh. 

Primary action elements should use a striking emerald-400, glowing subtly when hovered, shifting to emerald-500 when active. Secondary buttons should contrast beautifully with sapphire-500, enhancing the futuristic, high-end look. Key interactive elements should integrate smooth neon-like effects inspired by modern learning interfaces, using indigo-500 and cyan-400 accents for an elevated and dynamic feel. Notifications should stand out with rose-500 for alerts and amber-400 for progress indicators, ensuring immediate recognition without overwhelming the user. 

Spacing and layout must be meticulously crafted with generous padding, a grid-based structure, and well-balanced margins, preventing clutter and reinforcing a sophisticated, premium aesthetic. Typography should be sleek and modern, using a slightly rounded sans-serif font to balance readability with personality. Motion should be fluid and elegant, powered by Framer Motion, with soft hover effects, smooth transitions, and engaging micro-interactions to make navigation feel effortless and enjoyable. 

The entire UI must be built with Next.js and React, styled exclusively with Tailwind CSS, eliminating all SCSS files while ensuring a scalable and maintainable architecture. Next-themes should be seamlessly integrated for dark and light mode toggling. Radix UI and ShadCN UI should be leveraged for accessible, well-structured components that align with the polished, high-end design language.
Also icons are available using lucide-react. Every component should be fully restructured as needed to achieve a truly stunning, modern, and immersive experience that aligns perfectly with the innovative and engaging nature of 'WordPanda.'


Change every component on this folder src/containers/common/Games, also to to be more responsible, to works fine on a mobile phone and on a desktop. Please make sure to analise tsconfig to understand the alias paths and change the corrects components relateds, verify the package.json to see the packages availables. Also make sure that the component still works. You can split the components into small other components in a subfolder called "_components" or "_container" in this folder. Make this component the most beautiful component in the world. Remember, the components that must be changed are on this folder src/containers/common/Games folder
. Keep a clean design without a lot of gradients and make it more "panda". If you find ways to increase the performance, make it too. Improve the user experience also, if possible. Also, make it works really well with the options of change theme (dark and light theme). Be sure that the components still work. 

## Prompt for translate:

Analyze the files src\containers\providers\TranslationProvider.tsx and src\backend\domain\actions\Translation\getTranslations.action.ts to understand how translations are implemented, but do not modify any code in these files.

The getTranslations function retrieves translations on the server side, determining the user's preferred language based on profile settings, browser headers, and cookies. It dynamically imports the corresponding translation file from the locale directory and can be accessed via @action/getTranslation.action.

On the client side, translations are managed using import { useTranslation } from 'react-i18next'. This hook provides access to the current language and a function to switch languages dynamically. Ensure that useTranslation() is implemented correctly.

Translation JSON files are stored in src\locales and can be accessed using the alias @locales/. Do not alter any styles, structure, or functionality. Every user-visible text must be replaced with its corresponding translation using the correct implementation. Ensure that all translated texts are added to the JSON files while maintaining the existing structure.

