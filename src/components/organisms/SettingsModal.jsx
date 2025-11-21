import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useTheme } from '@/components/providers/ThemeProvider';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, textSize, changeTheme, changeTextSize, themes, textSizes } = useTheme();
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    const selectedThemeData = themes.find(t => t.id === newTheme);
    toast.success(`Switched to ${selectedThemeData.name} theme`);
  };

  const handleTextSizeChange = (e) => {
    const newSize = e.target.value;
    changeTextSize(newSize);
    const selectedSizeData = textSizes.find(s => s.id === newSize);
    toast.success(`Text size changed to ${selectedSizeData.name}`);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentTextSizeIndex = textSizes.findIndex(s => s.id === textSize);

  return (
    <div 
      className="settings-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        ref={modalRef}
        className="settings-modal theme-transition"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface">
          <h2 
            id="settings-title"
            className="text-xl font-display font-semibold text-primary"
          >
            Reading Settings
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-surface transition-colors rounded-full"
            aria-label="Close settings"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <ApperIcon name="Palette" size={20} />
              Theme
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`theme-preview ${themeOption.id} ${theme === themeOption.id ? 'active' : ''}`}
                  aria-pressed={theme === themeOption.id}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{themeOption.name}</span>
                    {theme === themeOption.id && (
                      <ApperIcon name="Check" size={16} className="text-accent" />
                    )}
                  </div>
                  <p className="text-sm opacity-80">{themeOption.description}</p>
                  
                  {/* Theme Preview */}
                  <div className="mt-3 space-y-1">
                    <div className="h-1 bg-current opacity-60 rounded"></div>
                    <div className="h-1 bg-current opacity-40 rounded w-3/4"></div>
                    <div className="h-1 bg-current opacity-30 rounded w-1/2"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Size */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <ApperIcon name="Type" size={20} />
              Text Size
            </h3>
            
            <div className="space-y-4">
              {/* Size Labels */}
              <div className="flex justify-between text-sm text-secondary">
                {textSizes.map((size) => (
                  <span key={size.id}>{size.name}</span>
                ))}
              </div>
              
              {/* Slider */}
              <input
                type="range"
                min={0}
                max={textSizes.length - 1}
                value={currentTextSizeIndex}
                onChange={(e) => {
                  const selectedSize = textSizes[parseInt(e.target.value)];
                  handleTextSizeChange({ target: { value: selectedSize.id } });
                }}
                className="text-size-slider"
                aria-label="Text size"
              />
              
              {/* Preview Text */}
              <div className="mt-4 p-4 bg-surface rounded-lg theme-transition">
                <p className="reading-content text-center">
                  "The art of writing is the art of discovering what you believe."
                </p>
                <p className="text-sm text-secondary text-center mt-2">
                  Current size: {textSizes.find(s => s.id === textSize)?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-surface">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-6"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;