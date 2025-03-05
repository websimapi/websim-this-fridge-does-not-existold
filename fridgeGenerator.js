class FridgeGenerator {
    constructor() {
        this.foodItems = {
            fruits: ['apple', 'banana', 'orange', 'grapes', 'strawberry', 'blueberry', 'pear', 'watermelon', 'kiwi'],
            vegetables: ['carrot', 'broccoli', 'lettuce', 'tomato', 'cucumber', 'bell pepper', 'spinach', 'onion', 'potato'],
            dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream cheese', 'eggs', 'sour cream'],
            meats: ['chicken', 'beef', 'pork', 'ham', 'turkey', 'bacon', 'sausage', 'steak'],
            beverages: ['water', 'juice', 'soda', 'beer', 'wine', 'iced tea', 'coffee'],
            condiments: ['ketchup', 'mustard', 'mayonnaise', 'hot sauce', 'salad dressing', 'soy sauce', 'maple syrup'],
            leftovers: ['pizza', 'pasta', 'soup', 'stew', 'rice', 'casserole', 'takeout food'],
            desserts: ['ice cream', 'cake', 'cookies', 'pudding', 'pie', 'chocolate', 'whipped cream']
        };
        
        this.fridgeStyles = [
            'modern stainless steel', 
            'retro 1950s', 
            'sleek minimalist', 
            'colorful vintage', 
            'smart refrigerator', 
            'compact dorm fridge', 
            'industrial restaurant fridge', 
            'luxury high-end'
        ];
        
        this.foodConditions = [
            'fresh', 
            'slightly old', 
            'expired', 
            'moldy', 
            'frozen', 
            'half-eaten', 
            'homemade', 
            'store-bought', 
            'organic'
        ];
    }

    async generateFridgeDescription(prompt) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a creative assistant that generates detailed descriptions of fictional refrigerator contents. 
                        Based on the user's input, create a vivid, detailed description of what might be found in their fictional fridge.
                        Include 6-12 specific food items with visual details (color, packaging, condition, placement).
                        Also describe the style and appearance of the fridge itself.
                        Be creative, humorous, and sometimes a bit strange or unexpected.
                        Your response should only be the description - no introductory text or explanations.
                        Format your response in a single paragraph.`
                    },
                    {
                        role: "user",
                        content: `Generate a detailed description of a fictional refrigerator based on this prompt: "${prompt}"`,
                    }
                ]
            });

            return completion.content.trim();
        } catch (error) {
            console.error("Error generating fridge description:", error);
            throw error;
        }
    }

    async generateFridgeContents(description) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You analyze refrigerator descriptions and extract specific food items to represent visually.
                        From the description provided, identify exactly 12 food items that would be in this fridge.
                        For each item, provide a common food emoji that best represents it.
                        Respond ONLY with JSON in the format:
                        {
                          "items": [
                            {"name": "item name", "emoji": "🍎"},
                            ...etc for all 12 items
                          ]
                        }`
                    },
                    {
                        role: "user",
                        content: description,
                    }
                ],
                json: true
            });

            return JSON.parse(completion.content);
        } catch (error) {
            console.error("Error generating fridge contents:", error);
            
            // Fallback to random contents if the LLM call fails
            return this.generateRandomContents();
        }
    }
    
    generateRandomContents() {
        const items = [];
        const categories = Object.keys(this.foodItems);
        
        // Ensure we get 12 different food items
        for (let i = 0; i < 12; i++) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const categoryItems = this.foodItems[randomCategory];
            const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
            
            // Pick a random emoji from a predefined set
            const emojis = ["🍎", "🍌", "🥕", "🥦", "🧀", "🥚", "🍗", "🥩", "🍕", "🍦", "🥫", "🍺"];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            items.push({ name: randomItem, emoji: randomEmoji });
        }
        
        return { items };
    }

    async generateFridgeImage(fridgeContents) {
        try {
            // We'll create our own visual representation using CSS and emojis
            // Just return the contents for now - the visual rendering will be handled by React
            return fridgeContents;
        } catch (error) {
            console.error("Error generating fridge image:", error);
            throw error;
        }
    }

    async generateFridge(prompt) {
        try {
            const description = await this.generateFridgeDescription(prompt);
            const contents = await this.generateFridgeContents(description);
            const fridgeData = await this.generateFridgeImage(contents);
            
            return {
                description,
                contents,
                fridgeData
            };
        } catch (error) {
            console.error("Error in fridge generation process:", error);
            throw error;
        }
    }
}

// Initialize the fridge generator
const fridgeGenerator = new FridgeGenerator();

