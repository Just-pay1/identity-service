import sequelize from '../database/database';
import User from '../models/userModel';

// Function to generate random phone number starting with "01" and 11 digits total
const generateRandomPhone = (): string => {
  // Start with "01"
  let phone = "01";
  
  // Add 9 more random digits to make it 11 digits total
  for (let i = 0; i < 9; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  
  return phone;
};

// Function to check if phone number already exists
const isPhoneUnique = async (phone: string): Promise<boolean> => {
  const existingUser = await User.findOne({ where: { phone } });
  return !existingUser;
};

// Function to generate unique phone number
const generateUniquePhone = async (): Promise<string> => {
  let phone: string;
  let isUnique = false;
  
  do {
    phone = generateRandomPhone();
    isUnique = await isPhoneUnique(phone);
  } while (!isUnique);
  
  return phone;
};

// Main seeder function
const updateUserPhoneNumbers = async (): Promise<void> => {
  try {
    console.log('Starting phone number update seeder...');
    
    // Get all users
    const users = await User.findAll();
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
      const newPhone = await generateUniquePhone();
      
      // Update user's phone number
      await user.update({ phone: newPhone });
      
      console.log(`Updated user ${user.id} (${user.name}): ${oldPhone} -> ${newPhone}`);
    }
    
    console.log('Phone number update completed successfully!');
    
  } catch (error) {
    console.error('Error updating phone numbers:', error);
    throw error;
  }
};

// Run the seeder if this file is executed directly
const runSeeder = async (): Promise<void> => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Run the seeder
    await updateUserPhoneNumbers();
    
    console.log('Seeder completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
};

// Export the function for potential reuse
export { updateUserPhoneNumbers };

// Run if this file is executed directly
if (require.main === module) {
  runSeeder();
} 