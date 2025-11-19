import { useState } from 'react'
import { CreditCard, Lock, Check, Sparkles } from 'lucide-react'

interface MockStripeCheckoutProps {
  amount: number
  currency?: string
  description: string
  onSuccess: () => void
  onCancel: () => void
}

export default function MockStripeCheckout({
  amount,
  currency = 'GBP',
  description,
  onSuccess,
  onCancel,
}: MockStripeCheckoutProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    if (formatted.replace(/\//g, '').length <= 4) {
      setExpiry(formatted)
    }
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '')
    if (value.length <= 3) {
      setCvc(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setProcessing(false)
    setSuccess(true)

    // Show success animation then call onSuccess
    setTimeout(() => {
      onSuccess()
    }, 1500)
  }

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvc.length === 3 && name.length > 0

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
            <Check className="w-10 h-10 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful!</h2>
          <p className="text-neutral-600 mb-4">Your booking has been confirmed</p>
          <div className="flex items-center justify-center gap-2 text-sm text-success-600">
            <Sparkles className="w-4 h-4" />
            <span>Receipt sent to your email</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Secure Checkout</h2>
            <div className="flex items-center gap-1 text-sm">
              <Lock className="w-4 h-4" />
              <span>Encrypted</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">
              {currency === 'GBP' ? '£' : '$'}
              {amount.toFixed(2)}
            </span>
            <span className="text-sm opacity-90">{currency}</span>
          </div>
          <p className="text-sm text-white/90 mt-1">{description}</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors pl-12"
                required
              />
              <CreditCard className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Use test card: 4242 4242 4242 4242
            </p>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="123"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Security Notice */}
          <div className="bg-neutral-50 rounded-xl p-3 mb-6 flex items-start gap-2">
            <Lock className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-neutral-600">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || processing}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay £{amount.toFixed(2)}
                </>
              )}
            </button>
          </div>

          {/* Powered by Stripe */}
          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-500">
              Powered by{' '}
              <span className="font-semibold text-primary-600">Stripe</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
