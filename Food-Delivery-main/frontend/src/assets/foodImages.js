// Mapping of food item names to their correct image filenames from the backend uploads folder.
// This centralized module ensures all dishes show accurate visuals.

export const foodImageMap = {
    // Starters
    "Samosa (2 pcs)": "1774595528069Samosa-Chaat-recipe-03.jpg",
    "Paneer Tikka": "1774542626728paneer-tikka-4.jpg",
    "Chicken Tikka": "1774515664649chicken-tikka-marinade-scaled.jpg",
    "Hara Bhara Kabab": "1774515772962hara-bhara-kebab_.jpg",
    "Chicken Tikka (6 pcs)": "1774515664649chicken-tikka-marinade-scaled.jpg",
    "Gobi Manchurian": "1774515834516GobiManchurian-ad8498d.jpg",
    "Vada Pav": "1774462426729vada-pav-3.jpg",
    "Chicken Lollipop": "1774609877919chicken-lollypop.webp",
    "Aloo Tikki Chaat": "1774609994642Aloo Tikki Chaat.jpeg",
    "Fish Fry": "1774592120401Fish Fry.webp",
    "Spring Roll": "1774610044291spring roll.jpg",
    "Paneer Kathi Roll": "1774463312604Paneer-kathi-Roll-Featured-1.jpg",
    "Chicken Kathi Roll": "1774463385875chicken-kathi-rolls_.jpg",
    "Veg Seekh Kebab": "1774463215460veg-seekh-kebab.jpg",
    "Mutton Seekh Kebab": "1774463710901ltupvfjg_seekh-kebab_625x300_18_May_20.webp",
    
    // Main Course
    "Paneer Butter Masala": "1774518209977paneer-butter-masala-5.webp",
    "Dal Makhani": "1774545146881Dal-Makhani-Blog.jpg",
    "Palak Paneer": "1774518287291Palak-Paneer.webp",
    "Butter Chicken": "1774547294379butter-chicken-ac2ff98.jpg",
    "Mutton Rogan Josh": "1774547321014Mutton Rogan Josh.avif",
    "Malai Kofta": "1774542777746Best-Malai-Kofta-recipe.jpg",
    "Aloo Gobi": "1774542898735Aloo-Gobi-Adraki-4.jpg",
    "Chana Masala": "1774547199829Chana Masala.jpg",
    "Kadai Paneer": "1774518494122kadai-paneer-2-500x500.jpg",
    "Yellow Dal Tadka": "1774543243802Yellow-Dal-4x5-1-LOW-RES.jpg",
    "Baingan Bharta": "1774542836500baingan-bharta.jpg",
    "Dum Aloo": "1774542942652dum-aloo-recipe.jpg",
    "Matar Paneer": "1774543348676Matar-Paneer.jpg",
    
    // Biryani & Rice
    "Chicken Dum Biryani": "1774549119464Chicken Dum Biryani.avif",
    "Veg Hyderabadi Biryani": "1774549133591Veg Hyderabadi Biryani.jpg",
    "Mutton Biryani": "1774549146485Best-Mutton-Biryani-Recipe.jpg",
    "Egg Biryani": "1774549176425Egg Biryani.jpg",
    "Jeera Rice": "1774546023251Jeera-Aloo-Recipe.jpg",
    "Tawa Pulao": "1774549723010Tawa Pulao.webp",
    "Saffron Rice": "1774549735808Saffron-Rice-SQ-1.jpg",
    "Ghee Rice": "1774551312711Ghee Rice.jpg",
    
    // Breads
    "Butter Naan": "1774551484613Butter Naan.jpg",
    "Garlic Naan": "1774551516122Garlic Naan.jpg",
    "Tandoori Roti": "1774551539040Tandoori Roti.jpg",
    "Lachha Paratha": "1774551586966Lachha-Paratha-2-3.jpg",
    "Aloo Paratha": "1774551632103aloo-paratha-recipe-500x500.jpg",
    "Paneer Paratha": "1774551652637paneer-paratha-2.jpg",
    
    // South Indian
    "Masala Dosa": "1774551754452masala-dosa-recipe-.jpg",
    "Idli (3 pcs)": "1774551776550idli.jpg",
    "Medu Vada": "1774551790591Medu Vada.jpg",
    "Onion Uthappam": "1774552609787onion-uthappam.webp",
    "Appam with Stew": "1774552721855Appam with Stew.jpg",
    
    // Desserts
    "Gulab Jamun (2 pcs)": "1774552922076Gulab Jamun.avif",
    "Rasgulla (2 pcs)": "1774553721233Rasgulla.jpg",
    "Gajar Ka Halwa": "1774553741289Gajar-Ka-Halwa-2.jpg",
    "Rasmalai": "1774553758417rasmalai_can_recipe.jpg",
    "Kulfi Pista": "1774553835032Kulfi Pista.avif",
    
    // Beverages
    "Masala Chai": "1774554585892Masala-Chai-.jpg",
    "Sweet Lassi": "1774556806679sweet-lassi-recipe-featured.webp",
    "Mango Lassi": "1774557726081Mango Lassi.jpg",
    "Filter Coffee": "1774593644518filter-coffee-recipe8.webp"
};

/**
 * Helper to get the correct image URL for a food item.
 * @param {string} name - The name of the food item.
 * @param {string} currentImage - The image filename currently stored for the item.
 * @param {string} url - The base backend URL.
 * @returns {string} - The full URL to the correct image.
 */
export const resolveFoodImage = (name, currentImage, url) => {
    const matchedFile = foodImageMap[name];
    
    // If we have an exact match in our mapping, use it.
    if (matchedFile) {
        return `${url}/images/${matchedFile}`;
    }
    
    // Keyword-based fallback for items not in the exact map
    const lowerName = name.toLowerCase();
    if (lowerName.includes("paneer")) return `${url}/images/1774518209977paneer-butter-masala-5.webp`;
    if (lowerName.includes("chicken")) return `${url}/images/1774515664649chicken-tikka-marinade-scaled.jpg`;
    if (lowerName.includes("biryani")) return `${url}/images/1774549119464Chicken Dum Biryani.avif`;
    if (lowerName.includes("dosa")) return `${url}/images/1774551754452masala-dosa-recipe-.jpg`;
    if (lowerName.includes("naan") || lowerName.includes("roti")) return `${url}/images/1774551484613Butter Naan.jpg`;
    if (lowerName.includes("lassi")) return `${url}/images/1774556806679sweet-lassi-recipe-featured.webp`;
    
    // If already a full URL or a backend filename, use it as is.
    if (currentImage && (currentImage.startsWith("http") || currentImage.length > 20)) {
        return currentImage.startsWith("http") ? currentImage : `${url}/images/${currentImage}`;
    }
    
    // Final fallback to a generic item
    return `${url}/images/food_1.png`;
};
