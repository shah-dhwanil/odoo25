import React, { useState } from 'react';
import {Button} from '../../ui/button';
import Icon from '../AppIcon';

const DemoCredentials = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'Customer',
      email: 'customer@rentflow.com',
      password: 'customer123',
      description: 'Access customer dashboard and booking features'
    },
    {
      role: 'Admin',
      email: 'admin@rentflow.com',
      password: 'admin123',
      description: 'Access admin dashboard and management features'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-0 h-auto text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center space-x-2">
          <Icon name="Info" size={16} />
          <span>Demo Credentials</span>
        </span>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
        />
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {credentials?.map((cred, index) => (
            <div key={index} className="p-3 bg-card rounded-md border border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">{cred?.role}</h4>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(cred?.email)}
                    className="h-6 w-6"
                    title="Copy email"
                  >
                    <Icon name="Copy" size={12} />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground w-16">Email:</span>
                  <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                    {cred?.email}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground w-16">Password:</span>
                  <code className="bg-muted px-1 py-0.5 rounded text-foreground">
                    {cred?.password}
                  </code>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {cred?.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DemoCredentials;