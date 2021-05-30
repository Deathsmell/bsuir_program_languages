const defaultPathToImage = './static/images/';
const getDefaultImageName = (sex, number) => `review-${sex}-${number}.jpeg`;
const FEMALE = 'female';
const MALE = 'male';
const DEFAULT_WIDTH = '190px'

const reviewsContainer = document.getElementById('reviews-container-id')

const reviews = [
    {
        name: 'Наталья',
        src: `${defaultPathToImage}${getDefaultImageName(FEMALE, 1)}`,
        description: 'Заказ делали через интернет. Замерщик подстроился под график работы. Установщики приехали вовремя, вежливые и аккуратные работники, и монтаж на отлично и главное быстро. Советую эту компанию!',
    },
    {
        name: 'Евгений',
        src: `${defaultPathToImage}${getDefaultImageName(MALE, 1)}`,
        description: 'Хотел бы поблагодарить сотрудников компании за отличную работу. Рекомендую всем, кто выбирает себе качественные двери и хороший сервис - не пожалеете!',
    },
    {
        name: 'Андрей',
        src: `${defaultPathToImage}${getDefaultImageName(MALE, 2)}`,
        description: 'Дважды пльзовался услугами компании, остался очень доволен. Консультанты помогли выбрать модели дверей, определиться с цветом.   Все работы по замеру, доставке и монтажу согласовывались в удобное для меня время и выполнялись в срок.',
    },
    {
        name: 'Ирина',
        src: `${defaultPathToImage}${getDefaultImageName(FEMALE, 2)}`,
        description: 'Выбрали эту компанию за надежность и качество. Консультанты грамотно все объяснили  отталкиваясь от наших приоритетов. Замер и установка прошли на раз-два. С мастерами таке же можно связаться по телефону. Отличная работа всей команды.',
    },
];

const defaultClassPrefix = 'review-'
const CONTAINER_CLASS = `${defaultClassPrefix}container`;
const IMAGE_CLASS = `${defaultClassPrefix}photo`;
const IMAGE_CONTAINER_CLASS = `${defaultClassPrefix}photo-container`;
const NAME_CLASS = `${defaultClassPrefix}name`;
const DESCRIPTION_CLASS = `${defaultClassPrefix}text`;

const createImageElement = (src) => {
    let div = document.createElement('div');
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Reviews photo';
    img.classList.add(IMAGE_CLASS);
    div.classList.add(IMAGE_CONTAINER_CLASS);
    div.appendChild(img);
    return div;
}

const createNameElement = (name) => {
    const span = document.createElement('span');
    span.classList.add(NAME_CLASS);
    span.textContent = name;
    return span;
}

const createHorizontalLineElement = (top, bottom) => {
    const hr = document.createElement('hr');
    hr.style.marginBottom = bottom ? `${bottom}px` : null;
    hr.style.marginTop = top ? `${top}px` : null;
    hr.style.height = '0';
    hr.style.width = DEFAULT_WIDTH;
    return hr;
}

const createDescriptionTextElement = (text) => {
    const div = document.createElement('div');
    div.classList.add(DESCRIPTION_CLASS);
    div.textContent = text;
    return div;
}

const createReviewContainer = () => {
    const div = document.createElement('div');
    div.classList.add(CONTAINER_CLASS);
    return div;
}

const createReviewComponent = (data) => {
    const container = createReviewContainer();
    container.appendChild(createImageElement(data.src));
    container.appendChild(createNameElement(data.name));
    container.appendChild(createHorizontalLineElement(15, 25));
    container.appendChild(createDescriptionTextElement(data.description));
    container.appendChild(createHorizontalLineElement(25));
    return container;
}

reviews.forEach((review) => {
    reviewsContainer.appendChild(createReviewComponent(review));
})




