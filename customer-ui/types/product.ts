export interface Product {
  _id: string;
  category: string;
  title_el: string;
  title_en: string;
  description_el: string;
  description_en:string;
  ingredients_el: Ingredient[];
  ingredients_en: Ingredient[];
  options_el:Option[];  
  options_en:Option[];  
  image: string;
  slug: string;
  price: number;
  productName:string;
}

export interface TranslatedProduct extends Product {
  title: string;        
  description: string;  
}

export interface Ingredient {
  _id:string;
  title: string;
  options: string[];
}

export interface Option{
  _id:string;
  title:string;
  options:string[];
}

// export interface IngredientOption {
//   title: string;
//   additionalPrice?: number; 
// }

// export interface OptionsOption{
//   title: string;
//  additionalPrice?: number;// TODO: IMPLEMENT ADDITIONAL PRICE PER INGREDIENT probably only here
// }

export interface CartItem {
  product: Product;
  quantity: number;
  selectedIngredients?:  Array<{
    option: string;
    index: number;
    en: string;
    el: string;
  }>; 
  selectedOptions?: Array<{
    group: string;
    options: Array<{ option: string; index: number; en: string; el: string }>;
  }>; 
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}
