# Real-Time File Handling Application - Architecture Documentation

## 1. Project Overview

The Real-Time File Handling Application is a Node.js-based application which work on event-based achiture monitor an input directory for new files using cron, automatically split new files into smaller chunks, and store them in an output directory. The application checks the chunk data in a concatenetd buffer with the original file for validating the chunks. The application follows an event based architecture for file monitoring, file processing, chunking process, and validation efficiently.

## 1. Architectural Components

### 1.1. Input Directory Monitoring (`fileMonitor.service.js`)

- **Purpose:** Monitors the `input` directory present at top level every 5 minutes to detect new files.
- **Operation:**
  - Uses a cron to periodically scan the input directory at every 5 minutes.
  - Emits a `FileFound` event for each newly detected file that has been not processed beforee.

### 1.2. Event Handling (`eventBus.utils.js`)

- **Purpose:** Provides a centralise eventEmitter to be used in different modules.

- **Operation:**
  - Provides a centralized event bus object for emitting and listening to events like `FileFound`, `ProcessFile`, and `ValidateChunks` in various modules based on requirements.

### 1.3. File Processing and Chunking (`fileChunking.service.js`)

- **Purpose:** Processes the files detected by the monitor service, splits them into smaller chunks of 10MB, and saves them in a uniquely named directory within output directory.
- **Operation:**
  - Listens for the `ProcessFile` event.
  - Creates a unique directory in the `output` folder based on the file name and current timestamp.
  - Splits the file into 10MB chunks using a Linux command (`split`) and saves these chunks in the newly created directory.
  - Emits a `ValidateChunks` event after the chunking process has complete.

### 1.4. File Validation (`fileValidation.service.js`)

- **Purpose:** Ensures that the chunking process did not result in any data loss by comparing the original file checksum with the concatenated buffered chunks.
- **Operation:**
  - Listens for the `ValidateChunks` event.
  - Computes the checksum of the original file.
  - Concatenates the chunked files into a single buffer and computes its checksum.
  - Compares both checksums to ensure data integrity.

---

## 2. Flow of Events

1. **File Monitoring:**

   - The cron job runs every 5 minutes, scanning the `input` directory for new files.
   - For each new file, the `FileFound` event is emitted, for the already processed file it logs that, that file has been processed already.

2. **File Processing and Chunking:**

   - The `fileProcessor.service.js` listens for the `FileFound` event.
   - If the file hasn’t been processed before, it adds the file path to a `processedFiles` set to prevent re-processing.
   - The service emits a `ProcessFile` event for each new file.
   - The `fileChunking.service.js` processes the file, creating a unique directory named after the file and timestamp, and saves the chunked files in this directory.
   - After chunking, it emits the `ValidateChunks` event.

3. **File Validation:**
   - The `fileValidationService.js` listens for the `ValidateChunks` event.
   - It verifies that the chunked files, when concatenated, match the original file's checksum, validating no data loss occurred during chunking.

---

## 3. Directory Structure

```
project-root/
│
├── input/                                 # Directory monitored for new files
│
├── output/                                # Directory where chunked files are stored
│   ├── exampleFile_20240825_120000/       # Example output directory
│   │   ├── exampleFile_chunk_aa
│   │   └── exampleFile_chunk_ab
│
├── src
│   ├──services/
│   │   ├── fileChunking.service.js        # Splits files into chunks and stores them
│   │   ├── fileMonitor.service.js         # Monitors input directory for new files
│   │   ├── fileProcessor.service.js       # Checkes file already processed and send non-processed file for processing
│   │   ├── fileValidation.service.js      # Validates integrity of chunked files
│   │   └── resultLogging.service.js       # Logs Validation successful or failed
│   │
│   ├── utils/
│   |   ├── checksum.utils.js              # Utilities for calculating checksum of files and chunks
│   │   ├── eventBus.utils.js              # Event bus for centralise service for file monitoring, and other operations
│   |   └── fileUtils.utils.js             # Utilities for chunking files and comparing files based on size
│   └── store
│   |   └── processedFiles.store.json            # stores already processed file name
│
├── index.js
├── package-lock.json                      # For ensuring that the same dependencies are installed consistently
├── package.json
└── README.md
```

---

## 4. Example Logs

- **File Found:**

  ```
  [2024-08-25 12:30:00] Scanning input folder...
  [2024-08-25 12:30:05] File /path/to/input/exampleFile.txt found. Processing...
  ```

- **File Chunking:**

  ```
  [2024-08-25 12:31:00] File /path/to/input/exampleFile.txt has been split and saved to /path/to/output/exampleFile_20240824_143000
  ```

- **Validation Success:**
  ```
  [2024-08-25 12:32:00] Validation successful: No data loss in file /path/to/input/exampleFile.txt
  ```

## 5. Steps to setup and run the applicatin

Follow these steps to run the Real-Time File Handling Application:

### 5.1. **Clone the Repository**

First, clone the repository to linux device:

```bash
git clone https://github.com/akarj/niit_node_file_handling_app.git
cd real-time-file-handling
```

### 5.2. **Install the packages**

Start the application:

```bash
npm start
```

Optionally, PM2 can be used to run the application in background. Follow the steps,

```bash
npm install -g pm2
cd path/to/project/cloned/
pm2 start index.js --name real-time-file-handler
```
