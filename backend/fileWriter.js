const { writeFile } = require('fs/promises');

module.exports = async (filePathOrders, content) => {
    try {
        return await writeFile(filePathOrders, content);
    } catch (error) {
        console.error(`File reading error: ${error.message}`);
    }
};
