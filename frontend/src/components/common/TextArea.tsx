import { TextareaHTMLAttributes, forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            {label}
            {props.required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              w-full px-4 py-3.5 rounded-xl
              bg-white border-2 border-neutral-200
              text-neutral-900 font-medium placeholder:text-neutral-400 placeholder:font-normal
              resize-none
              transition-all duration-200
              hover:border-neutral-300
              focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50
              ${error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500 pr-12' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Error indicator */}
          {error && (
            <div className="absolute right-4 top-4 text-danger-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm font-medium text-danger-600 flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
