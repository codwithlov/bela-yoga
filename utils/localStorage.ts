import dayjs from 'dayjs';

export const autoSave = (name: string, values: any) => {
    try {
        const existingData = localStorage.getItem(name);
        let savedData = existingData ? JSON.parse(existingData) : [];
        const newEntry = { ...values, autoSaveTime: dayjs().format('HH:mm:ss - DD/MM') };
        savedData.push(newEntry);
        if (savedData.length > 3) {
            savedData = (savedData as any[]).slice(-3);
        }
        localStorage.setItem(name, JSON.stringify(savedData));
    } catch (error) {
        console.error(error);
    }
}

export const saveSelectedColumns = (key: string, value: string[]) => {
    try {
        const storedColumns = JSON.parse(localStorage.getItem('selectedColumns') || '{}');
        localStorage.setItem("selectedColumns", JSON.stringify({ ...storedColumns, [key]: value }));
    } catch (error) {
        console.error("Error saving selectedColumns state to localStorage", error);
    }
};
