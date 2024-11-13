import { FormatDay } from "~/components/table/Format";
import { baseClient, baseURL } from ".";

export const getLdJsCourse = (course, info) => ({
    "@context": "https://schema.org/",
    "@id": course?.slug,
    "@type": "Course",
    "name": course?.name,
    "description": course?.description,
    "publisher": {
        "@type": "Organization",
        "name": `${info.name}`,
        "url": `${baseClient}`
    },
    "provider": {
        "@type": "Organization",
        "name": `${info.name}`,
        "url": `${baseClient}`
    },
    "image": [
        `${baseURL}/upload/course/${course.name}/${course?.imgDetail}`,
        `${baseURL}/upload/course/${course.name}/${course?.img}`
    ],
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": course?.star,
        "ratingCount": 2000,
        "reviewCount": 1200
    },
    "offers": [
        {
            "@type": "Offer",
            "category": course?.category,
            "priceCurrency": "VND",
            "price": course?.price
        }
    ],
    "hasCourseInstance": [
        {
            "@type": "CourseInstance",
            "courseMode": "Blended",
            "location": "HoChiMinh University",
            "courseSchedule": {
                "@type": "Schedule",
                "duration": "PT3H",
                "repeatFrequency": "Daily",
                "repeatCount": 31
            },
            "instructor": [
                {
                    "@type": "Person",
                    "name": "Nguyen Bac Trung Nam",
                    "description": "3D Artist",
                    "image": `${baseClient}`
                }
            ]
        },
        {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT22H"
        }
    ],
    "totalHistoricalEnrollment": 400,
    "datePublished": FormatDay(course?.createdAt),
    "educationalLevel": "Advanced",
    "about": [
        "3D Modeling",
        "3D environment",
        "3D artist"
    ],
    "teaches": [
        "Aris",
        "Understand how work 3D."
    ],
    "financialAidEligible": "Scholarship Available",
    "inLanguage": "vn",
    "availableLanguage": [
        "vn",
        "es"
    ],
    "coursePrerequisites": [
        "3D Modeling",
        `${baseClient}`
    ],
    "educationalCredentialAwarded": [
        {
            "@type": "EducationalOccupationalCredential",
            "name": "3D Modeling Certificate",
            "url": `${baseClient}`,
            "credentialCategory": "Certificate"
        }
    ]
})

export const getLdJsArticle = (article, info) => ({
    "@context": "https://schema.org/",
    "@id": article?.slug,
    "@type": "Article",
    "headline": article?.title,
    "description": article?.description,
    "author": {
        "@type": "Person",
        "name": "Aris",
        "url": `${baseClient}/author/${article?.slug}`
    },
    "publisher": {
        "@type": "Organization",
        "name": `${info.name}`,
        "url": `${baseClient}`,
        "logo": {
            "@type": "ImageObject",
            "url": `${baseURL}/upload/logo.png`
        }
    },

    "image": `${baseURL}/upload/article/${article?.image}`,
    "articleSection": article?.category,
    "keywords": article?.tags?.join(", "),
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseClient}/article/${article?.slug}`
    },
    "inLanguage": "vn",
    "about": [
        "Truyền thông",
        "Tin tức",
        "Đổi mới sáng tạo"
    ],
    "audience": {
        "@type": "Audience",
        "audienceType": "General"
    },
    "isPartOf": {
        "@type": "CreativeWorkSeries",
        "name": "Bài viết trên website"
    }
});

