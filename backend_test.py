import requests
import sys
import json
from datetime import datetime
import os

class KebabHutAPITester:
    def __init__(self, base_url="https://larochelle-kebab.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_api_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        
        # Default headers
        default_headers = {'Content-Type': 'application/json'}
        if self.token:
            default_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            default_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected: {expected_status})"
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f" - {response.text[:100]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {"status": "success"}
            return None

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return None

    def test_auth_register(self):
        """Test user registration"""
        test_email = f"admin_{datetime.now().strftime('%H%M%S')}@kebabhut.com"
        test_password = "AdminPass123!"
        
        response = self.run_api_test(
            "Auth - Register New User",
            "POST",
            "auth/register",
            200,
            {"email": test_email, "password": test_password}
        )
        
        if response and 'access_token' in response:
            self.token = response['access_token']
            self.test_email = test_email
            return True
        return False

    def test_auth_login(self):
        """Test user login with existing credentials"""
        if not hasattr(self, 'test_email'):
            self.log_test("Auth - Login (No user to test)", False, "Registration failed")
            return False
            
        response = self.run_api_test(
            "Auth - Login Existing User",
            "POST", 
            "auth/login",
            200,
            {"email": self.test_email, "password": "AdminPass123!"}
        )
        
        if response and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_auth_me(self):
        """Test get current user info"""
        response = self.run_api_test(
            "Auth - Get Current User",
            "GET",
            "auth/me", 
            200
        )
        return response is not None

    def test_get_menu(self):
        """Test get menu items (public endpoint)"""
        response = self.run_api_test(
            "Menu - Get All Items (Public)",
            "GET",
            "menu",
            200
        )
        
        if response is not None:
            self.menu_items = response
            return True
        return False

    def test_get_categories(self):
        """Test get categories (public endpoint)"""
        response = self.run_api_test(
            "Categories - Get All (Public)",
            "GET", 
            "categories",
            200
        )
        return response is not None

    def test_init_menu(self):
        """Test menu initialization"""
        response = self.run_api_test(
            "Admin - Initialize Default Menu",
            "POST",
            "admin/init-menu",
            200,
            {}
        )
        return response is not None

    def test_create_menu_item(self):
        """Test creating a new menu item"""
        new_item = {
            "category": "kebabs",
            "name": "Test Kebab Special",
            "description": "Test kebab for API testing",
            "price": "99,99 €",
            "image": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
            "popular": True
        }
        
        response = self.run_api_test(
            "Admin - Create Menu Item",
            "POST",
            "admin/menu",
            200,
            new_item
        )
        
        if response and 'id' in response:
            self.test_item_id = response['id']
            return True
        return False

    def test_update_menu_item(self):
        """Test updating a menu item"""
        if not hasattr(self, 'test_item_id'):
            self.log_test("Admin - Update Menu Item (No item to test)", False, "Create item failed")
            return False
            
        update_data = {
            "name": "Updated Test Kebab",
            "price": "88,88 €",
            "popular": False
        }
        
        response = self.run_api_test(
            "Admin - Update Menu Item",
            "PUT",
            f"admin/menu/{self.test_item_id}",
            200,
            update_data
        )
        return response is not None

    def test_delete_menu_item(self):
        """Test deleting a menu item"""
        if not hasattr(self, 'test_item_id'):
            self.log_test("Admin - Delete Menu Item (No item to test)", False, "Create item failed")
            return False
            
        response = self.run_api_test(
            "Admin - Delete Menu Item",
            "DELETE",
            f"admin/menu/{self.test_item_id}",
            200
        )
        return response is not None

    def test_upload_endpoint_without_file(self):
        """Test upload endpoint accessibility (without actual file)"""
        # This will fail but we can check if the endpoint is accessible
        response = self.run_api_test(
            "Admin - Upload Endpoint Check",
            "POST",
            "admin/upload",
            422  # Expected to fail without file, but should be accessible
        )
        return response is not None

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🚀 Starting Kebab Hut API Tests...")
        print(f"📍 Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_auth_register,
            self.test_auth_login, 
            self.test_auth_me,
            self.test_get_menu,
            self.test_get_categories,
            self.test_init_menu,
            self.test_create_menu_item,
            self.test_update_menu_item,
            self.test_delete_menu_item,
            self.test_upload_endpoint_without_file
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_test(f"Exception in {test.__name__}", False, str(e))
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"✅ Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Failed: {self.tests_run - self.tests_passed}/{self.tests_run}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Return success if most tests pass
        return self.tests_passed >= (self.tests_run * 0.8)

def main():
    tester = KebabHutAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": (tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0,
        "test_details": tester.test_results
    }
    
    with open("/app/backend_api_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_api_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())