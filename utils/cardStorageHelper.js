import * as SecureStore from 'expo-secure-store';

export const CardStorageHelper = {
    // Save card to secure storage
    async saveCard(cardData) {
        try {
            const existingCards = await this.getCards();
            const cardWithId = {
                ...cardData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            
            const updatedCards = [...existingCards, cardWithId];
            
            await SecureStore.setItemAsync('user_cards', JSON.stringify(updatedCards));
            return cardWithId.id; // Return the generated ID
        } catch (error) {
            console.error('Error saving card:', error);
            return null;
        }
    },

    // Get all saved cards
    async getCards() {
        try {
            const cardsJson = await SecureStore.getItemAsync('user_cards');
            return cardsJson ? JSON.parse(cardsJson) : [];
        } catch (error) {
            console.error('Error getting cards:', error);
            return [];
        }
    },

    // Get default card
    async getDefaultCard() {
        const cards = await this.getCards();
        return cards.find(card => card.isDefault) || cards[0];
    },

    // Delete card
    async deleteCard(cardId) {
        try {
            const cards = await this.getCards();
            const updatedCards = cards.filter(card => card.id !== cardId);
            await SecureStore.setItemAsync('user_cards', JSON.stringify(updatedCards));
            return true;
        } catch (error) {
            console.error('Error deleting card:', error);
            return false;
        }
    },

    // Set default card
    async setDefaultCard(cardId) {
        try {
            const cards = await this.getCards();
            const updatedCards = cards.map(card => ({
                ...card,
                isDefault: card.id === cardId
            }));
            await SecureStore.setItemAsync('user_cards', JSON.stringify(updatedCards));
            return true;
        } catch (error) {
            console.error('Error setting default card:', error);
            return false;
        }
    },

    // Clear all cards
    async clearAllCards() {
        try {
            await SecureStore.deleteItemAsync('user_cards');
            return true;
        } catch (error) {
            console.error('Error clearing cards:', error);
            return false;
        }
    },

    // Format card for display (masked number)
    formatCardDisplay(cardNumber) {
        if (!cardNumber) return '•••• •••• •••• ••••';
        const lastFour = cardNumber.slice(-4);
        return `•••• •••• •••• ${lastFour}`;
    },

    // Get card type from number
    getCardType(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        if (/^4/.test(cleanNumber)) return 'VISA';
        if (/^5[1-5]/.test(cleanNumber)) return 'MASTER';
        if (/^3[47]/.test(cleanNumber)) return 'AMEX';
        if (/^6(?:011|5)/.test(cleanNumber)) return 'DISCOVER';
        return 'OTHER';
    },

    // Validate card using Luhn algorithm
    validateCardNumber(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        
        if (cleanNumber.length < 13 || cleanNumber.length > 19) {
            return false;
        }

        let sum = 0;
        let isEven = false;

        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    },

    // Validate expiry date
    validateExpiry(expiry) {
        if (!expiry || !expiry.includes('/')) return false;
        
        const [month, year] = expiry.split('/');
        if (!month || !year || month.length !== 2 || year.length !== 2) return false;

        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (monthNum < 1 || monthNum > 12) return false;
        if (yearNum < currentYear) return false;
        if (yearNum === currentYear && monthNum < currentMonth) return false;

        return true;
    }
};