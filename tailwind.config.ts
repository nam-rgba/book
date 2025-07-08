// tailwind.config.js

import lineClamp from '@tailwindcss/line-clamp';

export default {
    theme: {
        extend: {
            fontFamily: {
                jakarta: ['Plus Jakarta Sans', 'sans-serif'],
            },
            boxShadow: {
                shoft: '0px 1px 3px 0px rgba(0, 0, 0, 0.02), 0px 0px 0px 1px rgba(27, 31, 35, 0.15)',
            },
        },
    },
    plugins: [
        lineClamp, // 👈 thêm dòng này vào đây
    ],
}