/**
 * API Service for communicating with Google Apps Script Backend
 */

const GAS_URL = (import.meta as any).env.VITE_GAS_WEB_APP_URL;

export const apiService = {
  /**
   * Initialize the Google Sheets database structure
   */
  async setupDatabase() {
    if (!GAS_URL) return null;
    try {
      const response = await fetch(`${GAS_URL}?action=setup`);
      return await response.json();
    } catch (error) {
      console.error('Error setting up database:', error);
      return null;
    }
  },

  /**
   * Fetch all students from Google Sheets
   */
  async getStudents() {
    if (!GAS_URL) return null;
    try {
      const response = await fetch(`${GAS_URL}?action=getStudents`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      return null;
    }
  },

  /**
   * Fetch all tahfidz records from Google Sheets
   */
  async getTahfidz() {
    if (!GAS_URL) return null;
    try {
      const response = await fetch(`${GAS_URL}?action=getTahfidz`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tahfidz:', error);
      return null;
    }
  },

  /**
   * Fetch all finance records from Google Sheets
   */
  async getFinance() {
    if (!GAS_URL) return null;
    try {
      const response = await fetch(`${GAS_URL}?action=getFinance`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching finance:', error);
      return null;
    }
  },

  /**
   * Fetch all attendance records from Google Sheets
   */
  async getAttendance() {
    if (!GAS_URL) return null;
    try {
      const response = await fetch(`${GAS_URL}?action=getAttendance`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return null;
    }
  },

  /**
   * Save student grade to Google Sheets
   */
  async saveGrade(studentId: string, subject: string, grade: number) {
    if (!GAS_URL) return null;
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POSTs
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveGrades',
          payload: { studentId, subject, grade }
        })
      });
      return { success: true }; // no-cors doesn't return response body
    } catch (error) {
      console.error('Error saving grade:', error);
      return { success: false, error };
    }
  },

  /**
   * Save attendance record to Google Sheets
   */
  async saveAttendance(studentId: string, studentName: string, status: string) {
    if (!GAS_URL) return null;
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveAttendance',
          payload: { studentId, studentName, status }
        })
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving attendance:', error);
      return { success: false, error };
    }
  },

  /**
   * Save a tahfidz record to Google Sheets
   */
  async saveTahfidz(studentId: string, surah: string, ayat: string, status: string) {
    if (!GAS_URL) return null;
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveTahfidz',
          payload: { studentId, surah, ayat, status }
        })
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving tahfidz:', error);
      return { success: false, error };
    }
  },

  /**
   * Save a finance record to Google Sheets
   */
  async saveFinance(studentId: string, type: string, amount: number, date?: string, status?: string) {
    if (!GAS_URL) return null;
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveFinance',
          payload: { studentId, type, amount, date, status }
        })
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving finance:', error);
      return { success: false, error };
    }
  },

  /**
   * Add a new student
   */
  async addStudent(student: { id: string; name: string; class: string; phone: string; grades?: string }) {
    if (!GAS_URL) return null;
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addStudent',
          payload: student
        })
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding student:', error);
      return { success: false, error };
    }
  },

  /**
   * Update an existing student
   */
  async updateStudent(student: { id: string; name: string; class: string; phone: string; grades?: string }) {
    if (!GAS_URL) return null;
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStudent',
          payload: student
        })
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating student:', error);
      return { success: false, error };
    }
  },

  /**
   * Delete a student
   */
  async deleteStudent(id: string) {
    if (!GAS_URL) return null;
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteStudent',
          payload: { id }
        })
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting student:', error);
      return { success: false, error };
    }
  }
};
