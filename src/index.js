import { createRoot } from 'react-dom/client';
import App from './App/App';
import reportWebVitals from './reportWebVitals';

// Create root and render App
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Report web vitals if needed
reportWebVitals();
