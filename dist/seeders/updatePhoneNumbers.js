"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPhoneNumbers = void 0;
const database_1 = __importDefault(require("../database/database"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Function to generate random phone number starting with "01" and 11 digits total
const generateRandomPhone = () => {
    // Start with "01"
    let phone = "01";
    // Add 9 more random digits to make it 11 digits total
    for (let i = 0; i < 9; i++) {
        phone += Math.floor(Math.random() * 10);
    }
    return phone;
};
// Function to check if phone number already exists
const isPhoneUnique = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield userModel_1.default.findOne({ where: { phone } });
    return !existingUser;
});
// Function to generate unique phone number
const generateUniquePhone = () => __awaiter(void 0, void 0, void 0, function* () {
    let phone;
    let isUnique = false;
    do {
        phone = generateRandomPhone();
        isUnique = yield isPhoneUnique(phone);
    } while (!isUnique);
    return phone;
});
// Main seeder function
const updateUserPhoneNumbers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Starting phone number update seeder...');
        // Get all users
        const users = yield userModel_1.default.findAll();
        console.log(`Found ${users.length} users to update`);
        if (users.length === 0) {
            console.log('No users found in the database');
            return;
        }
        // Update each user's phone number
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const oldPhone = user.phone;
            // Generate unique phone number
            const newPhone = yield generateUniquePhone();
            // Update user's phone number
            yield user.update({ phone: newPhone });
            console.log(`Updated user ${user.id} (${user.name}): ${oldPhone} -> ${newPhone}`);
        }
        console.log('Phone number update completed successfully!');
    }
    catch (error) {
        console.error('Error updating phone numbers:', error);
        throw error;
    }
});
exports.updateUserPhoneNumbers = updateUserPhoneNumbers;
// Run the seeder if this file is executed directly
const runSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test database connection
        yield database_1.default.authenticate();
        console.log('Database connection established successfully.');
        // Run the seeder
        yield updateUserPhoneNumbers();
        console.log('Seeder completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Seeder failed:', error);
        process.exit(1);
    }
});
// Run if this file is executed directly
if (require.main === module) {
    runSeeder();
}
