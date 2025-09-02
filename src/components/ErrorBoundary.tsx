import type { ReactNode } from 'react'
import React, { Component } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">Something went wrong. Please try refreshing the page.</p>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary