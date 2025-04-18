// Admin Menu Visibility Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin menu should be shown
    checkAdminMenuVisibility();
    
    // Also check when auth state changes
    document.addEventListener('authStateChanged', checkAdminMenuVisibility);
});

// Function to check and update admin menu visibility
async function checkAdminMenuVisibility() {
    const adminMenuLink = document.getElementById('adminMenuLink');
    if (!adminMenuLink) {
        console.error('Admin menu link not found');
        return;
    }
    
    try {
        // First check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, hiding admin menu');
            adminMenuLink.style.display = 'none';
            return;
        }
        
        console.log('Token found, checking admin status');
        
        // Check if user is admin
        const isAdmin = await checkIsAdminUser();
        console.log('Admin check result:', isAdmin);
        
        // Show admin menu if user is admin
        adminMenuLink.style.display = isAdmin ? 'block' : 'none';
        
        if (isAdmin) {
            console.log('Showing admin menu');
        } else {
            console.log('Hiding admin menu - user is not admin');
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        adminMenuLink.style.display = 'none';
    }
}

// Check if current user is an admin
async function checkIsAdminUser() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('No token available for admin check');
            return false;
        }
        
        // Try direct user data check first (might be faster)
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.is_admin === true) {
                    console.log('User is admin based on local data');
                    return true;
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        
        console.log('Making admin check request to server');
        
        // Make request to admin check endpoint
        const response = await fetch('/admin/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Admin check response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Admin check response data:', result);
            return result.is_admin === true;
        }
        
        console.log('Admin check failed with status:', response.status);
        return false;
    } catch (error) {
        console.error('Admin check error:', error);
        return false;
    }
}