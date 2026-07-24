export interface IProduct {
    _id: string;
    category: string;
    title_en: string;
    title_el: string;
    description_en: string;
    description_el: string;
    ingredients_en?: OptionsEntry[];
    ingredients_el?: OptionsEntry[];
    options_en?: OptionsEntry[];
    options_el?: OptionsEntry[];
    price: string;
    image?: string;
}

interface OptionsEntry {
    title: String;
    options: String[];
}
