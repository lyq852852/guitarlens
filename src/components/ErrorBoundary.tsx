/**
 * 错误边界组件
 * 捕获子组件的错误并显示友好的错误提示
 */

import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.retry) || (
          <div className="error-boundary">
            <div className="error-container">
              <h2>❌ 出错了</h2>
              <p className="error-message">{this.state.error.message}</p>
              <button onClick={this.retry} className="retry-button">
                重试
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
