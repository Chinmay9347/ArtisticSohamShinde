import {
  BASE_PRICES,
  CUSTOM_BACKGROUND_PRICE,
  EXTRA_PERSON_PRICE,
  FRAME_PRICE,
} from "@/constants/pricing";

import {
  PortraitSize,
} from "@/types/commission";

export function calculateCommissionPrice(
  size: PortraitSize,
  persons: number,
  frame: boolean,
  background: string,
) {
  let total = BASE_PRICES[size];

  if (persons > 1) {
    total += (persons - 1) * EXTRA_PERSON_PRICE;
  }

  if (frame) {
    total += FRAME_PRICE;
  }

  if (background === "Custom") {
    total += CUSTOM_BACKGROUND_PRICE;
  }

  return total;
}

// import {

// BASE_PRICES,

// CUSTOM_BACKGROUND_PRICE,

// EXTRA_PERSON_PRICE,

// FRAME_PRICE,

// } from "@/constants/pricing";

// import {

// BackgroundStyle,

// PortraitSize,

// } from "@/types/commission";

// export function calculateCommissionPrice(

// size:PortraitSize,

// persons:number,

// frame:boolean,

// background:BackgroundStyle

// ){

// let total=BASE_PRICES[size];

// if(persons>1){

// total+=(persons-1)*EXTRA_PERSON_PRICE;

// }

// if(frame){

// total+=FRAME_PRICE;

// }

// if(background==="Custom"){

// total+=CUSTOM_BACKGROUND_PRICE;

// }

// return{

// subtotal,

// discount,

// shipping,

// total

// };

// }