const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headers = null;
    this.lineNumber = 0;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    
    this.buffer += chunk.toString();
     
    const lines = this.buffer.split(/\r?\n/);
     
    this.buffer = lines.pop() || '';
     
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '') continue;
      
      if (this.headers === null) {
      
        this.headers = this.parseCSVLine(trimmedLine);
      } else {
         
        const values = this.parseCSVLine(trimmedLine);
        const record = {};
        for (let i = 0; i < this.headers.length; i++) {
          record[this.headers[i]] = values[i] || '';
        }
        this.push(record);
      }
      this.lineNumber++;
    }
    
    callback();
  }

  _flush(callback) {
  
    if (this.buffer.trim()) {
      const trimmedLine = this.buffer.trim();
      if (this.headers === null) {
        this.headers = this.parseCSVLine(trimmedLine);
      } else {
        const values = this.parseCSVLine(trimmedLine);
        const record = {};
        for (let i = 0; i < this.headers.length; i++) {
          record[this.headers[i]] = values[i] || '';
        }
        this.push(record);
      }
    }
    callback();
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    
    return result;
  }
}
 
class DataTransformer extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
  }

  _transform(record, encoding, callback) {
   
    if (record.name) {
      record.name = capitalizeName(record.name);
    }
   
    if (record.email) {
      record.email = normalizeEmail(record.email);
    }
    
    
    if (record.phone) {
      record.phone = formatPhone(record.phone);
    }
     
    if (record.birthdate) {
      record.birthdate = standardizeDate(record.birthdate);
    }
     
    if (record.city) {
      record.city = capitalizeName(record.city);
    }
     
    this.push(record);
    
    callback();
  }
}
 
class CSVWriter extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headerWritten = false;
    this.headers = null;
  }

  _transform(record, encoding, callback) {
    
    if (!this.headerWritten) {
      this.headers = Object.keys(record);
      const headerLine = this.headers.map(h => this.escapeCSV(h)).join(',');
      this.push(headerLine + '\n');
      this.headerWritten = true;
    }
     
    const values = this.headers.map(header => {
      const value = record[header] || '';
      return this.escapeCSV(String(value));
    });
    
    this.push(values.join(',') + '\n');
    
    callback();
  }

  escapeCSV(value) {
    
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  }
}
 
function capitalizeName(name) {
  if (!name || typeof name !== 'string') return name || '';
  
  
  const parts = name.split(/([\s-])/);
   
  const capitalized = parts.map(part => {
    if (part.length === 0) return part;
    if (/[\s-]/.test(part)) return part; 
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  
  return capitalized.join('');
}
 
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return email || '';
 
  const normalized = email.toLowerCase().trim();
   
  if (normalized.includes('@') && normalized.includes('.')) {
    const atIndex = normalized.indexOf('@');
    const dotAfterAt = normalized.indexOf('.', atIndex);
    if (atIndex > 0 && dotAfterAt > atIndex + 1) {
      return normalized;
    }
  }
  
  return email;
}
 
function formatPhone(phone) {
  if (!phone || typeof phone !== 'string') return 'INVALID';
   
  const digits = phone.replace(/\D/g, '');
 
  if (digits.length === 10) {
    
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return 'INVALID';
}
 
function standardizeDate(date) {
  if (!date || typeof date !== 'string') return date || '';
  
  const trimmed = date.trim();
  let year, month, day;
   
  let match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    month = match[1].padStart(2, '0');
    day = match[2].padStart(2, '0');
    year = match[3];
  }
   
  if (!match) {
    match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
      year = match[1];
      month = match[2].padStart(2, '0');
      day = match[3].padStart(2, '0');
    }
  }
   
  if (!match) {
    match = trimmed.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    if (match) {
      year = match[1];
      month = match[2].padStart(2, '0');
      day = match[3].padStart(2, '0');
    }
  }
  
  if (match) {
    
    const dateObj = new Date(`${year}-${month}-${day}`);
    if (!isNaN(dateObj.getTime()) &&
        dateObj.getFullYear() === parseInt(year) &&
        dateObj.getMonth() + 1 === parseInt(month) &&
        dateObj.getDate() === parseInt(day)) {
      return `${year}-${month}-${day}`;
    }
  }
  
  return date;
}
 
async function processCSVFile(inputPath, outputPath) {
  try {
    
    const readStream = fs.createReadStream(inputPath);
    
    
    const csvParser = new CSVParser();
    const dataTransformer = new DataTransformer();
    const csvWriter = new CSVWriter();
    
    // 
    const writeStream = fs.createWriteStream(outputPath);
     
    await pipeline(
      readStream,
      csvParser,
      dataTransformer,
      csvWriter,
      writeStream
    );
  } catch (error) {
    throw new Error(`Failed to process CSV file: ${error.message}`);
  }
}
 
function createSampleData() {
  const dataDir = path.join(process.cwd(), "data");
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const sampleCSV = `name,email,phone,birthdate,city
john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
bob johnson,BOB@TEST.COM,5559876543,03/22/1992,chicago
alice brown,alice.brown@company.org,9876543210,1988/07/04,houston`;

  fs.writeFileSync(path.join(dataDir, "users.csv"), sampleCSV);
  console.log("Sample data created in", dataDir);
}

module.exports = {
  CSVParser,
  DataTransformer,
  CSVWriter,
  processCSVFile,
  capitalizeName,
  normalizeEmail,
  formatPhone,
  standardizeDate,
  createSampleData,
};
