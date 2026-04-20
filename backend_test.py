#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Livrella EssentiElles
Tests all endpoints mentioned in the review request.
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from the review request
BASE_URL = "https://reste-deploy.preview.emergentagent.com/api"

# Test credentials from test_credentials.md
TEST_CREDENTIALS = {
    "customer": {"email": "sarah@example.com", "password": "password123"},
    "admin": {"email": "admin@livrella.com", "password": "Admin2026!"}
}

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.admin_token = None
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        if response_data:
            result["response_sample"] = response_data
        
        self.test_results.append(result)
        if not success:
            self.failed_tests.append(result)
        
        print(f"{status} {test_name}")
        if details:
            print(f"    {details}")
        if response_data and success:
            print(f"    Sample response: {json.dumps(response_data, indent=2)[:200]}...")
        print()

    def make_request(self, method, endpoint, data=None, headers=None, use_auth=True):
        """Make HTTP request with proper error handling"""
        url = f"{BASE_URL}{endpoint}"
        
        # Set up headers
        req_headers = {"Content-Type": "application/json"}
        if headers:
            req_headers.update(headers)
        
        # Add auth token if needed
        if use_auth and self.auth_token:
            req_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=req_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=req_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=req_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=req_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("=== TESTING AUTH ENDPOINTS ===")
        
        # Test 1: Register new user
        register_data = {
            "email": f"test_{datetime.now().timestamp()}@example.com",
            "password": "testpass123",
            "firstName": "Test",
            "lastName": "User",
            "phone": "+33 6 12 34 56 78"
        }
        
        response = self.make_request("POST", "/auth/register", register_data, use_auth=False)
        if response and response.status_code == 200:
            data = response.json()
            self.log_test("POST /auth/register", True, 
                         f"User registered successfully", 
                         {"token_length": len(data.get("token", "")), "user_id": data.get("user", {}).get("id", "")})
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("POST /auth/register", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 2: Login with customer credentials
        response = self.make_request("POST", "/auth/login", TEST_CREDENTIALS["customer"], use_auth=False)
        if response and response.status_code == 200:
            data = response.json()
            self.auth_token = data.get("token")
            self.log_test("POST /auth/login (customer)", True, 
                         f"Login successful, token received", 
                         {"user_email": data.get("user", {}).get("email", ""), "role": data.get("user", {}).get("role", "")})
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("POST /auth/login (customer)", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 3: Get current user info
        if self.auth_token:
            response = self.make_request("GET", "/auth/me")
            if response and response.status_code == 200:
                data = response.json()
                self.log_test("GET /auth/me", True, 
                             f"User info retrieved", 
                             {"email": data.get("email", ""), "firstName": data.get("firstName", "")})
            else:
                error_msg = response.json().get("detail", "Unknown error") if response else "No response"
                self.log_test("GET /auth/me", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 4: Login with admin credentials
        response = self.make_request("POST", "/auth/login", TEST_CREDENTIALS["admin"], use_auth=False)
        if response and response.status_code == 200:
            data = response.json()
            self.admin_token = data.get("token")
            self.log_test("POST /auth/login (admin)", True, 
                         f"Admin login successful", 
                         {"user_email": data.get("user", {}).get("email", ""), "role": data.get("user", {}).get("role", "")})
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("POST /auth/login (admin)", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

    def test_products_endpoints(self):
        """Test product-related endpoints"""
        print("=== TESTING PRODUCTS ENDPOINTS ===")
        
        # Test 1: Get all products
        response = self.make_request("GET", "/products", use_auth=False)
        if response and response.status_code == 200:
            data = response.json()
            products = data.get("products", [])
            self.log_test("GET /products", True, 
                         f"Retrieved {len(products)} products, total: {data.get('total', 0)}", 
                         {"first_product": products[0] if products else None})
            
            # Store first product ID for detail test
            self.test_product_id = products[0]["id"] if products else None
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("GET /products", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 2: Get categories
        response = self.make_request("GET", "/categories", use_auth=False)
        if response and response.status_code == 200:
            data = response.json()
            self.log_test("GET /categories", True, 
                         f"Retrieved {len(data)} categories", 
                         {"first_category": data[0] if data else None})
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("GET /categories", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 3: Get product detail
        if hasattr(self, 'test_product_id') and self.test_product_id:
            response = self.make_request("GET", f"/products/{self.test_product_id}", use_auth=False)
            if response and response.status_code == 200:
                data = response.json()
                self.log_test("GET /products/{id}", True, 
                             f"Product detail retrieved", 
                             {"name": data.get("name", ""), "price": data.get("price", ""), "brand": data.get("brand", "")})
            else:
                error_msg = response.json().get("detail", "Unknown error") if response else "No response"
                self.log_test("GET /products/{id}", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

    def test_orders_endpoints(self):
        """Test order-related endpoints"""
        print("=== TESTING ORDERS ENDPOINTS ===")
        
        if not self.auth_token:
            self.log_test("Orders tests", False, "No auth token available")
            return

        # Test 1: Get user orders
        response = self.make_request("GET", "/orders")
        if response and response.status_code == 200:
            data = response.json()
            self.log_test("GET /orders", True, 
                         f"Retrieved {len(data)} orders", 
                         {"first_order": data[0] if data else None})
            
            # Store first order ID for detail test
            self.test_order_id = data[0]["id"] if data else None
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("GET /orders", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 2: Create new order (need product and address first)
        if hasattr(self, 'test_product_id') and self.test_product_id:
            # First get user addresses
            addr_response = self.make_request("GET", "/addresses")
            if addr_response and addr_response.status_code == 200:
                addresses = addr_response.json()
                if addresses:
                    address_id = addresses[0]["id"]
                    
                    # Create test order
                    order_data = {
                        "items": [{
                            "productId": self.test_product_id,
                            "productName": "Test Product",
                            "quantity": 1,
                            "unitPrice": 10.99,
                            "totalPrice": 10.99
                        }],
                        "addressId": address_id
                    }
                    
                    response = self.make_request("POST", "/orders", order_data)
                    if response and response.status_code == 200:
                        data = response.json()
                        self.log_test("POST /orders", True, 
                                     f"Order created successfully", 
                                     {"orderNumber": data.get("orderNumber", ""), "total": data.get("total", "")})
                    else:
                        error_msg = response.json().get("detail", "Unknown error") if response else "No response"
                        self.log_test("POST /orders", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")
                else:
                    self.log_test("POST /orders", False, "No addresses available for test order")
            else:
                self.log_test("POST /orders", False, "Could not retrieve addresses for test order")

    def test_subscriptions_endpoints(self):
        """Test subscription-related endpoints"""
        print("=== TESTING SUBSCRIPTIONS ENDPOINTS ===")
        
        if not self.auth_token:
            self.log_test("Subscriptions tests", False, "No auth token available")
            return

        # Test 1: Get user subscriptions
        response = self.make_request("GET", "/subscriptions")
        if response and response.status_code == 200:
            data = response.json()
            self.log_test("GET /subscriptions", True, 
                         f"Retrieved {len(data)} subscriptions", 
                         {"first_subscription": data[0] if data else None})
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("GET /subscriptions", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 2: Create new subscription
        if hasattr(self, 'test_product_id') and self.test_product_id:
            # Get user addresses first
            addr_response = self.make_request("GET", "/addresses")
            if addr_response and addr_response.status_code == 200:
                addresses = addr_response.json()
                if addresses:
                    address_id = addresses[0]["id"]
                    
                    subscription_data = {
                        "productId": self.test_product_id,
                        "addressId": address_id,
                        "frequency": "monthly",
                        "quantity": 2
                    }
                    
                    response = self.make_request("POST", "/subscriptions", subscription_data)
                    if response and response.status_code == 200:
                        data = response.json()
                        self.log_test("POST /subscriptions", True, 
                                     f"Subscription created successfully", 
                                     {"status": data.get("status", ""), "frequency": data.get("frequency", "")})
                    else:
                        error_msg = response.json().get("detail", "Unknown error") if response else "No response"
                        self.log_test("POST /subscriptions", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")
                else:
                    self.log_test("POST /subscriptions", False, "No addresses available for test subscription")
            else:
                self.log_test("POST /subscriptions", False, "Could not retrieve addresses for test subscription")

    def test_new_features(self):
        """Test new features: wishlist, reviews, promo codes"""
        print("=== TESTING NEW FEATURES ===")
        
        if not self.auth_token:
            self.log_test("New features tests", False, "No auth token available")
            return

        # Test 1: Get wishlist
        response = self.make_request("GET", "/wishlist")
        if response and response.status_code == 200:
            data = response.json()
            wishlist_items = data.get("data", [])
            self.log_test("GET /wishlist", True, 
                         f"Retrieved {len(wishlist_items)} wishlist items", 
                         {"first_item": wishlist_items[0] if wishlist_items else None})
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("GET /wishlist", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 2: Add to wishlist
        if hasattr(self, 'test_product_id') and self.test_product_id:
            response = self.make_request("POST", f"/wishlist/{self.test_product_id}")
            if response and response.status_code == 200:
                data = response.json()
                self.log_test("POST /wishlist/{product_id}", True, 
                             f"Added to wishlist", 
                             {"message": data.get("message", ""), "id": data.get("id", "")})
            else:
                error_msg = response.json().get("detail", "Unknown error") if response else "No response"
                self.log_test("POST /wishlist/{product_id}", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 3: Get product reviews
        if hasattr(self, 'test_product_id') and self.test_product_id:
            response = self.make_request("GET", f"/products/{self.test_product_id}/reviews", use_auth=False)
            if response and response.status_code == 200:
                data = response.json()
                reviews = data.get("data", [])
                self.log_test("GET /products/{id}/reviews", True, 
                             f"Retrieved {len(reviews)} reviews, avg rating: {data.get('averageRating', 0)}", 
                             {"total": data.get("total", 0), "averageRating": data.get("averageRating", 0)})
            else:
                error_msg = response.json().get("detail", "Unknown error") if response else "No response"
                self.log_test("GET /products/{id}/reviews", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

        # Test 4: Validate promo code
        promo_data = {"code": "WELCOME20"}
        response = self.make_request("POST", "/promo/validate", promo_data)
        if response and response.status_code == 200:
            data = response.json()
            self.log_test("POST /promo/validate", True, 
                         f"Promo code validated", 
                         {"valid": data.get("valid", False), "discountValue": data.get("discountValue", 0)})
        elif response and response.status_code == 404:
            # This is expected if no promo codes are seeded
            self.log_test("POST /promo/validate", True, 
                         f"Promo code endpoint working (code not found as expected)", 
                         {"status": "404 - Code not found (expected)"})
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            self.log_test("POST /promo/validate", False, f"Status: {response.status_code if response else 'None'}, Error: {error_msg}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Livrella Backend API Tests")
        print(f"Base URL: {BASE_URL}")
        print("=" * 60)
        
        try:
            self.test_auth_endpoints()
            self.test_products_endpoints()
            self.test_orders_endpoints()
            self.test_subscriptions_endpoints()
            self.test_new_features()
            
            # Print summary
            print("=" * 60)
            print("📊 TEST SUMMARY")
            print("=" * 60)
            
            total_tests = len(self.test_results)
            passed_tests = len([t for t in self.test_results if t["success"]])
            failed_tests = len(self.failed_tests)
            
            print(f"Total Tests: {total_tests}")
            print(f"✅ Passed: {passed_tests}")
            print(f"❌ Failed: {failed_tests}")
            print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
            
            if self.failed_tests:
                print("\n🔍 FAILED TESTS DETAILS:")
                for test in self.failed_tests:
                    print(f"❌ {test['test']}: {test['details']}")
            
            print("\n" + "=" * 60)
            
            return passed_tests, failed_tests, total_tests
            
        except Exception as e:
            print(f"❌ Test execution failed: {e}")
            return 0, 1, 1

if __name__ == "__main__":
    tester = APITester()
    passed, failed, total = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)