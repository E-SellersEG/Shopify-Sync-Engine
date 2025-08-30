

import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { LogEntry, LogType } from '../types';

const LOG_TYPE_STYLES: { [key in LogType]: { bg: string; text: string; label: string, darkBg: string, darkText: string } } = {
  INFO:    { bg: 'bg-gray-100',    text: 'text-gray-800',   label: 'INFO',    darkBg: 'dark:bg-gray-700',     darkText: 'dark:text-gray-200' },
  SUCCESS: { bg: 'bg-green-100',   text: 'text-green-800',  label: 'SUCCESS', darkBg: 'dark:bg-green-900/50', darkText: 'dark:text-green-300' },
  WARN:    { bg: 'bg-yellow-100',  text: 'text-yellow-800', label: 'WARN',    darkBg: 'dark:bg-yellow-900/50',darkText: 'dark:text-yellow-300' },
  ERROR:   { bg: 'bg-red-100',     text: 'text-red-800',    label: 'ERROR',   darkBg: 'dark:bg-red-900/50',   darkText: 'dark:text-red-300' },
};


const LogLine: React.FC<{ log: LogEntry }> = ({ log }) => {
    const styles = LOG_TYPE_STYLES[log.type];
    return (
        <div className={`flex items-start text-sm p-2 rounded-md ${styles.bg} ${styles.darkBg}`}>
            <span className="font-mono text-gray-500 dark:text-gray-400 mr-3">{log.timestamp}</span>
            <span className={`font-bold mr-3 ${styles.text} ${styles.darkText}`}>[{styles.label}]</span>
            <span className={`flex-1 whitespace-pre-wrap break-words text-gray-700 ${styles.darkText}`}>{log.message}</span>
        </div>
    );
};


const LogViewer: React.FC = () => {
    const context = useContext(AppContext);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!context) return null;
    const { logs, clearLogs } = context;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);


    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Sync Logs</h3>
                <button onClick={clearLogs} className="text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-1 px-3 rounded-md transition-colors">
                    Clear Logs
                </button>
            </div>
            <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto font-mono space-y-2 bg-white dark:bg-gray-800">
                {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        Logs will appear here when a sync is running.
                    </div>
                ) : (
                    logs.map((log, index) => <LogLine key={index} log={log} />)
                )}
            </div>
        </div>
    );
};

export default LogViewer;