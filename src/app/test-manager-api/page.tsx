"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkEmailAvailability, getRegistrationRequirements } from "@/lib/managerRegistrationApi";

export default function TestManagerApiPage() {
  const [email, setEmail] = useState("test@example.com");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testEmailCheck = async () => {
    setLoading(true);
    try {
      console.log('Testing email check for:', email);
      const result = await checkEmailAvailability(email);
      console.log('Email check result:', result);
      addResult('Email Check', result);
    } catch (error) {
      console.error('Email check error:', error);
      addResult('Email Check Error', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRequirements = async () => {
    setLoading(true);
    try {
      console.log('Testing requirements endpoint');
      const result = await getRegistrationRequirements();
      console.log('Requirements result:', result);
      addResult('Requirements', result);
    } catch (error) {
      console.error('Requirements error:', error);
      addResult('Requirements Error', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    try {
      console.log('Testing direct fetch to email endpoint');
      const response = await fetch(`http://localhost:8081/manager/api/healthlink/v1/check-email/${email}`);
      console.log('Direct fetch response status:', response.status);
      console.log('Direct fetch response headers:', Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log('Direct fetch response text:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = { rawResponse: text };
      }

      addResult('Direct Fetch', {
        status: response.status,
        ok: response.ok,
        result
      });
    } catch (error) {
      console.error('Direct fetch error:', error);
      addResult('Direct Fetch Error', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manager API Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Test Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <Button onClick={testEmailCheck} disabled={loading}>
              Test Email Check
            </Button>
          </div>

          <div className="flex gap-4">
            <Button onClick={testRequirements} disabled={loading}>
              Test Requirements
            </Button>
            <Button onClick={testDirectFetch} disabled={loading}>
              Test Direct Fetch
            </Button>
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-gray-500">No test results yet. Run a test above.</p>
          ) : (
            <div className="space-y-4">
              {results.map((item, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item.test}</h4>
                    <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(item.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}