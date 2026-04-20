#!/usr/bin/env python3
"""
Final comprehensive test for EssentiElles as requested in the review
Tests all specific endpoints mentioned in the review request
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Base URL from the review request
BASE_URL = "https://reste-deploy.preview.emergentagent.com/api"

class FinalAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.user_id = None
        self.test_results = []
        self.created_resources = {
            "addresses": [],
            "orders": [],
            "subscriptions": []
        }
        
    def log_result(self, endpoint: str, method: str, status: str, details: str = ""):
        """Log test result"""
        result = {
            "endpoint": f"{method} {endpoint}",
            "status": status,
            "details": details
        }
        self.test_results.append(result)
        
        # Print real-time results
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} {method} {endpoint}")
        if details:
            print(f"   {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> requests.Response:
        """Make HTTP request with proper headers"""
        url = f"{BASE_URL}{endpoint}"
        
        # Default headers
        default_headers = {"Content-Type": "application/json"}
        if self.auth_token:
            default_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise

    def test_1_authentication(self):
        """Test 1: Authentication endpoints as specified in review"""
        print("\n=== 1. AUTHENTIFICATION ===")
        
        # Register test@android.com / Pass123!
        register_data = {
            "email": "test@android.com",
            "password": "Pass123!",
            "firstName": "Test",
            "lastName": "Android"
        }
        
        try:
            response = self.make_request("POST", "/auth/register", register_data)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data:
                    self.log_result("/auth/register", "POST", "PASS", "User registered successfully")
                else:
                    self.log_result("/auth/register", "POST", "FAIL", "No token in response")
            elif response.status_code == 400 and "déjà utilisé" in response.text:
                self.log_result("/auth/register", "POST", "PASS", "User already exists (expected behavior)")
            else:
                self.log_result("/auth/register", "POST", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/auth/register", "POST", "FAIL", f"Exception: {str(e)}")

        # Login with test@android.com / Pass123!
        login_data = {
            "email": "test@android.com",
            "password": "Pass123!"
        }
        
        try:
            response = self.make_request("POST", "/auth/login", login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data:
                    self.auth_token = data["token"]
                    self.user_id = data.get("user", {}).get("id")
                    self.log_result("/auth/login", "POST", "PASS", f"Token received, User ID: {self.user_id}")
                else:
                    self.log_result("/auth/login", "POST", "FAIL", "No token in response")
            else:
                self.log_result("/auth/login", "POST", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/auth/login", "POST", "FAIL", f"Exception: {str(e)}")

        # Get current user with token
        if self.auth_token:
            try:
                response = self.make_request("GET", "/auth/me")
                
                if response.status_code == 200:
                    data = response.json()
                    if "id" in data and "email" in data:
                        self.log_result("/auth/me", "GET", "PASS", f"User data retrieved: {data.get('email')}")
                    else:
                        self.log_result("/auth/me", "GET", "FAIL", "Invalid user data structure")
                else:
                    self.log_result("/auth/me", "GET", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                    
            except Exception as e:
                self.log_result("/auth/me", "GET", "FAIL", f"Exception: {str(e)}")

    def test_2_catalogue_products(self):
        """Test 2: Catalogue & Products as specified in review"""
        print("\n=== 2. CATALOGUE & PRODUITS ===")
        
        # GET /api/products
        try:
            response = self.make_request("GET", "/products")
            
            if response.status_code == 200:
                data = response.json()
                if "products" in data and isinstance(data["products"], list) and len(data["products"]) > 0:
                    products = data["products"]
                    self.log_result("/products", "GET", "PASS", f"Retrieved {len(products)} products")
                    
                    # Store first product for later tests
                    self.test_product = products[0]
                    self.test_product_id = self.test_product.get("id")
                    
                else:
                    self.log_result("/products", "GET", "FAIL", "No products returned or invalid structure")
            else:
                self.log_result("/products", "GET", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/products", "GET", "FAIL", f"Exception: {str(e)}")

        # GET /api/categories
        try:
            response = self.make_request("GET", "/categories")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_result("/categories", "GET", "PASS", f"Retrieved {len(data)} categories")
                else:
                    self.log_result("/categories", "GET", "FAIL", "No categories returned")
            else:
                self.log_result("/categories", "GET", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/categories", "GET", "FAIL", f"Exception: {str(e)}")

        # GET /api/products/{id} (using ID from products list)
        if hasattr(self, 'test_product_id') and self.test_product_id:
            try:
                response = self.make_request("GET", f"/products/{self.test_product_id}")
                
                if response.status_code == 200:
                    product_data = response.json()
                    self.log_result(f"/products/{self.test_product_id}", "GET", "PASS", f"Product details retrieved: {product_data.get('name', 'Unknown')}")
                else:
                    self.log_result(f"/products/{self.test_product_id}", "GET", "FAIL", f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"/products/{self.test_product_id}", "GET", "FAIL", f"Exception: {str(e)}")

    def test_5_addresses(self):
        """Test 5: Addresses as specified in review"""
        print("\n=== 5. ADRESSES ===")
        
        if not self.auth_token:
            self.log_result("/addresses", "GET", "FAIL", "No auth token")
            return
        
        # GET /api/addresses
        try:
            response = self.make_request("GET", "/addresses")
            
            if response.status_code == 200:
                addresses = response.json()
                self.log_result("/addresses", "GET", "PASS", f"Retrieved {len(addresses)} addresses")
                
                # Store existing address for later use
                if addresses:
                    self.existing_address_id = addresses[0].get("id")
                
            else:
                self.log_result("/addresses", "GET", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/addresses", "GET", "FAIL", f"Exception: {str(e)}")

        # POST /api/addresses (create address as specified in review)
        address_data = {
            "label": "Domicile",
            "firstName": "Test",
            "lastName": "User",
            "street": "123 Rue Test",
            "city": "Paris",
            "zipCode": "75001",
            "country": "France",
            "isDefault": True
        }
        
        try:
            response = self.make_request("POST", "/addresses", address_data)
            
            if response.status_code == 200:
                created_address = response.json()
                address_id = created_address.get("id")
                self.created_resources["addresses"].append(address_id)
                self.test_address_id = address_id
                self.log_result("/addresses", "POST", "PASS", f"Address created with ID: {address_id}")
                
            else:
                self.log_result("/addresses", "POST", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/addresses", "POST", "FAIL", f"Exception: {str(e)}")

        # PUT /api/addresses/{id} (modify address)
        if hasattr(self, 'test_address_id'):
            update_data = {
                "label": "Domicile Modifié",
                "street": "456 Rue Updated",
                "city": "Paris",
                "postalCode": "75001",
                "country": "France",
                "isDefault": True
            }
            
            try:
                response = self.make_request("PUT", f"/addresses/{self.test_address_id}", update_data)
                
                if response.status_code == 200:
                    self.log_result(f"/addresses/{self.test_address_id}", "PUT", "PASS", "Address updated successfully")
                else:
                    self.log_result(f"/addresses/{self.test_address_id}", "PUT", "FAIL", f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"/addresses/{self.test_address_id}", "PUT", "FAIL", f"Exception: {str(e)}")

    def test_3_orders(self):
        """Test 3: Orders as specified in review"""
        print("\n=== 3. COMMANDES ===")
        
        if not self.auth_token:
            self.log_result("/orders", "GET", "FAIL", "No auth token")
            return
        
        # Ensure we have product and address for order creation
        if not hasattr(self, 'test_product_id') or not self.test_product_id:
            self.log_result("/orders", "POST", "FAIL", "No product ID available for order creation")
            return
            
        # Get address ID (use existing or created one)
        address_id = getattr(self, 'test_address_id', None) or getattr(self, 'existing_address_id', None)
        if not address_id:
            self.log_result("/orders", "POST", "FAIL", "No address ID available for order creation")
            return

        # POST /api/orders (create order as specified in review)
        order_data = {
            "items": [
                {
                    "productId": self.test_product_id,
                    "productName": self.test_product.get("name", "Test Product"),
                    "quantity": 2,
                    "unitPrice": 10.99,
                    "totalPrice": 21.98
                }
            ],
            "addressId": address_id
        }
        
        try:
            response = self.make_request("POST", "/orders", order_data)
            
            if response.status_code == 200:
                created_order = response.json()
                order_id = created_order.get("id")
                self.created_resources["orders"].append(order_id)
                self.test_order_id = order_id
                self.log_result("/orders", "POST", "PASS", f"Order created with ID: {order_id}")
                
            else:
                self.log_result("/orders", "POST", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/orders", "POST", "FAIL", f"Exception: {str(e)}")

        # GET /api/orders (list user orders)
        try:
            response = self.make_request("GET", "/orders")
            
            if response.status_code == 200:
                orders = response.json()
                self.log_result("/orders", "GET", "PASS", f"Retrieved {len(orders)} orders")
            else:
                self.log_result("/orders", "GET", "FAIL", f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("/orders", "GET", "FAIL", f"Exception: {str(e)}")

        # GET /api/orders/{id} (get order details)
        if hasattr(self, 'test_order_id'):
            try:
                response = self.make_request("GET", f"/orders/{self.test_order_id}")
                
                if response.status_code == 200:
                    order_details = response.json()
                    self.log_result(f"/orders/{self.test_order_id}", "GET", "PASS", f"Order details retrieved: {order_details.get('orderNumber', 'Unknown')}")
                else:
                    self.log_result(f"/orders/{self.test_order_id}", "GET", "FAIL", f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"/orders/{self.test_order_id}", "GET", "FAIL", f"Exception: {str(e)}")

    def test_4_subscriptions(self):
        """Test 4: Subscriptions as specified in review"""
        print("\n=== 4. ABONNEMENTS ===")
        
        if not self.auth_token:
            self.log_result("/subscriptions", "GET", "FAIL", "No auth token")
            return
        
        # Ensure we have product and address for subscription creation
        if not hasattr(self, 'test_product_id') or not self.test_product_id:
            self.log_result("/subscriptions", "POST", "FAIL", "No product ID available")
            return
            
        address_id = getattr(self, 'test_address_id', None) or getattr(self, 'existing_address_id', None)
        if not address_id:
            self.log_result("/subscriptions", "POST", "FAIL", "No address ID available")
            return

        # POST /api/subscriptions (create subscription as specified in review)
        subscription_data = {
            "productId": self.test_product_id,
            "addressId": address_id,
            "frequency": "monthly",
            "quantity": 1
        }
        
        try:
            response = self.make_request("POST", "/subscriptions", subscription_data)
            
            if response.status_code == 200:
                created_subscription = response.json()
                subscription_id = created_subscription.get("id")
                self.created_resources["subscriptions"].append(subscription_id)
                self.test_subscription_id = subscription_id
                self.log_result("/subscriptions", "POST", "PASS", f"Subscription created with ID: {subscription_id}")
                
            else:
                self.log_result("/subscriptions", "POST", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/subscriptions", "POST", "FAIL", f"Exception: {str(e)}")

        # GET /api/subscriptions (list subscriptions)
        try:
            response = self.make_request("GET", "/subscriptions")
            
            if response.status_code == 200:
                subscriptions = response.json()
                self.log_result("/subscriptions", "GET", "PASS", f"Retrieved {len(subscriptions)} subscriptions")
            else:
                self.log_result("/subscriptions", "GET", "FAIL", f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("/subscriptions", "GET", "FAIL", f"Exception: {str(e)}")

        # Test subscription management (pause, resume, cancel)
        if hasattr(self, 'test_subscription_id'):
            # POST /api/subscriptions/{id}/pause
            try:
                response = self.make_request("POST", f"/subscriptions/{self.test_subscription_id}/pause")
                
                if response.status_code == 200:
                    self.log_result(f"/subscriptions/{self.test_subscription_id}/pause", "POST", "PASS", "Subscription paused")
                else:
                    self.log_result(f"/subscriptions/{self.test_subscription_id}/pause", "POST", "FAIL", f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"/subscriptions/{self.test_subscription_id}/pause", "POST", "FAIL", f"Exception: {str(e)}")

            # POST /api/subscriptions/{id}/resume
            try:
                response = self.make_request("POST", f"/subscriptions/{self.test_subscription_id}/resume")
                
                if response.status_code == 200:
                    self.log_result(f"/subscriptions/{self.test_subscription_id}/resume", "POST", "PASS", "Subscription resumed")
                else:
                    self.log_result(f"/subscriptions/{self.test_subscription_id}/resume", "POST", "FAIL", f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"/subscriptions/{self.test_subscription_id}/resume", "POST", "FAIL", f"Exception: {str(e)}")

            # DELETE /api/subscriptions/{id} (cancel subscription)
            try:
                response = self.make_request("DELETE", f"/subscriptions/{self.test_subscription_id}")
                
                if response.status_code == 200:
                    self.log_result(f"/subscriptions/{self.test_subscription_id}", "DELETE", "PASS", "Subscription cancelled")
                    # Remove from cleanup list since it's already deleted
                    if self.test_subscription_id in self.created_resources["subscriptions"]:
                        self.created_resources["subscriptions"].remove(self.test_subscription_id)
                else:
                    self.log_result(f"/subscriptions/{self.test_subscription_id}", "DELETE", "FAIL", f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"/subscriptions/{self.test_subscription_id}", "DELETE", "FAIL", f"Exception: {str(e)}")

    def test_6_profile_update(self):
        """Test 6: Profile update as specified in review"""
        print("\n=== 6. PROFIL UTILISATEUR ===")
        
        if not self.auth_token:
            self.log_result("/auth/me", "PUT", "FAIL", "No auth token")
            return
        
        # PUT /api/auth/me (modify profile as specified in review)
        update_data = {
            "firstName": "TestModified",
            "lastName": "User"
        }
        
        try:
            response = self.make_request("PUT", "/auth/me", update_data)
            
            if response.status_code == 200:
                updated_user = response.json()
                self.log_result("/auth/me", "PUT", "PASS", f"Profile updated: {updated_user.get('firstName')} {updated_user.get('lastName')}")
            else:
                self.log_result("/auth/me", "PUT", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_result("/auth/me", "PUT", "FAIL", f"Exception: {str(e)}")

    def cleanup_resources(self):
        """Clean up created test resources"""
        print("\n=== NETTOYAGE ===")
        
        # Delete remaining subscriptions
        for sub_id in self.created_resources["subscriptions"]:
            try:
                response = self.make_request("DELETE", f"/subscriptions/{sub_id}")
                if response.status_code == 200:
                    print(f"✅ Deleted subscription {sub_id}")
                else:
                    print(f"⚠️ Could not delete subscription {sub_id}")
            except:
                print(f"⚠️ Error deleting subscription {sub_id}")
        
        # Delete created addresses
        for addr_id in self.created_resources["addresses"]:
            try:
                response = self.make_request("DELETE", f"/addresses/{addr_id}")
                if response.status_code == 200:
                    print(f"✅ Deleted address {addr_id}")
                else:
                    print(f"⚠️ Could not delete address {addr_id}")
            except:
                print(f"⚠️ Error deleting address {addr_id}")

    def print_final_summary(self):
        """Print final test summary as requested in review"""
        print("\n" + "="*80)
        print("RÉSULTAT FINAL - VALIDATION COMPLÈTE EssentiElles")
        print("="*80)
        
        passed = sum(1 for result in self.test_results if result["status"] == "PASS")
        failed = sum(1 for result in self.test_results if result["status"] == "FAIL")
        partial = sum(1 for result in self.test_results if result["status"] == "PARTIAL")
        total = len(self.test_results)
        
        print(f"Total des tests: {total}")
        print(f"✅ Fonctionnels: {passed}")
        print(f"❌ Erreurs: {failed}")
        print(f"⚠️ Partiels: {partial}")
        print(f"Taux de réussite: {(passed/total)*100:.1f}%")
        
        print("\nListe détaillée de tous les endpoints testés:")
        for result in self.test_results:
            status_emoji = "✅" if result["status"] == "PASS" else "❌" if result["status"] == "FAIL" else "⚠️"
            print(f"{status_emoji} {result['endpoint']} - {result['status']}")
            if result["details"]:
                print(f"   {result['details']}")
        
        print("\n" + "="*80)
        if failed == 0:
            print("🎉 SUCCÈS COMPLET! L'application Android est 100% fonctionnelle!")
        else:
            print(f"⚠️ {failed} endpoint(s) nécessitent une attention.")
        print("="*80)

    def run_all_tests(self):
        """Run all tests as specified in the review request"""
        print("🚀 Test complet final de l'application EssentiElles")
        print(f"Base URL: {BASE_URL}")
        print("="*80)
        
        try:
            # Run tests in the order specified in the review
            self.test_1_authentication()
            self.test_2_catalogue_products()
            self.test_5_addresses()  # Run addresses before orders/subscriptions
            self.test_3_orders()
            self.test_4_subscriptions()
            self.test_6_profile_update()
            
            # Cleanup
            self.cleanup_resources()
            
            # Print final summary
            self.print_final_summary()
            
        except KeyboardInterrupt:
            print("\nTest interrompu par l'utilisateur")
            self.cleanup_resources()
        except Exception as e:
            print(f"\nErreur inattendue pendant les tests: {e}")
            self.cleanup_resources()

if __name__ == "__main__":
    tester = FinalAPITester()
    tester.run_all_tests()