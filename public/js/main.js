// Show alert function with animation
function showAlert(message, type = 'error') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.style.opacity = '0';
        setTimeout(() => existingAlert.remove(), 300);
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.display = 'block';
    alert.style.opacity = '0';

    // Insert alert at the top of main content
    const main = document.querySelector('main');
    main.insertBefore(alert, main.firstChild);

    // Animate in
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s ease';
        alert.style.opacity = '1';
    }, 10);

    // Auto-hide after 4 seconds
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// Character counter
function updateCharCount(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    
    if (input && counter) {
        const length = input.value.length;
        const maxLength = input.getAttribute('maxlength') || 200;
        counter.textContent = `${length}/${maxLength}`;
        
        // Remove all classes first
        counter.classList.remove('warning', 'danger');
        
        // Warn when approaching limit
        if (length > maxLength * 0.9) {
            counter.classList.add('danger');
        } else if (length > maxLength * 0.75) {
            counter.classList.add('warning');
        }
    }
}

// Set loading state
function setLoadingState(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline';
        } else {
            button.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }
}

// Character counter listeners
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const editTaskInput = document.getElementById('editTaskInput');
    
    if (taskInput) {
        taskInput.addEventListener('input', () => updateCharCount('taskInput', 'charCount'));
        updateCharCount('taskInput', 'charCount');
    }
    
    if (editTaskInput) {
        editTaskInput.addEventListener('input', () => updateCharCount('editTaskInput', 'editCharCount'));
    }
});

// Todo Form Submission
document.getElementById('todoForm')?.addEventListener('submit', function(e) {
    const taskInput = document.getElementById('taskInput');
    const taskValue = taskInput?.value.trim() || '';

    if (taskValue === '') {
        e.preventDefault();
        showToast('Please enter a task before adding!', 'error');
        taskInput?.focus();
        return false;
    }

    // Check length
    if (taskValue.length > 200) {
        e.preventDefault();
        showToast('Task cannot exceed 200 characters!', 'error');
        taskInput?.focus();
        return false;
    }

    // Set loading state
    setLoadingState('addBtn', true);
});

// Edit Todo Function with better escaping
function editTodo(id, task, priority) {
    // Decode HTML entities and restore escaped quotes
    const decodedTask = task
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&');

    editTodoFromData(id, decodedTask, priority);
}

// Edit Todo from button data attributes
function editTodoFromButton(button) {
    const id = button.getAttribute('data-edit-id');
    const task = button.getAttribute('data-edit-task').replace(/&quot;/g, '"');
    const priority = button.getAttribute('data-edit-priority');
    editTodoFromData(id, task, priority);
}

// Main edit function
function editTodoFromData(id, task, priority) {
    const editModal = document.getElementById('editModal');
    const editId = document.getElementById('editId');
    const editTaskInput = document.getElementById('editTaskInput');
    const editPrioritySelect = document.getElementById('editPrioritySelect');

    if (!editModal || !editId || !editTaskInput || !editPrioritySelect) return;

    // Decode HTML entities and restore escaped quotes
    const decodedTask = task
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&');

    editId.value = id;
    editTaskInput.value = decodedTask;
    editPrioritySelect.value = priority;
    
    // Update character count
    updateCharCount('editTaskInput', 'editCharCount');
    
    // Show modal
    editModal.style.display = 'block';
    editModal.setAttribute('aria-hidden', 'false');
    
    // Focus on input
    setTimeout(() => editTaskInput.focus(), 100);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close Edit Modal
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
        editModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.reset();
        setLoadingState('updateBtn', false);
    }
}

// Edit Form Submission
document.getElementById('editForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('editId')?.value;
    const task = document.getElementById('editTaskInput')?.value.trim() || '';
    const priority = document.getElementById('editPrioritySelect')?.value;

    if (task === '') {
        showToast('Task cannot be empty! Please enter a task.', 'error');
        document.getElementById('editTaskInput')?.focus();
        return;
    }

    if (task.length > 200) {
        showToast('Task cannot exceed 200 characters!', 'error');
        document.getElementById('editTaskInput')?.focus();
        return;
    }

    // Set loading state
    setLoadingState('updateBtn', true);

    // Send PUT request
    fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, priority })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to update task');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            closeEditModal();
            updateTodoInDOM(data.todo);
            updateStatistics();
            showToast('Task updated successfully!', 'success');
        } else {
            showToast(data.error || 'Failed to update task', 'error');
            setLoadingState('updateBtn', false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast(error.message || 'An error occurred while updating the task', 'error');
        setLoadingState('updateBtn', false);
    });
});

// Delete Todo Function with confirmation modal
let deleteTodoId = null;

function deleteTodo(id) {
    deleteTodoId = id;
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.style.display = 'block';
        confirmModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus on cancel button for better accessibility
        const cancelBtn = confirmModal.querySelector('.btn-secondary');
        if (cancelBtn) {
            setTimeout(() => cancelBtn.focus(), 100);
        }
    }
}

// Close Confirmation Modal
function closeConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.style.display = 'none';
        confirmModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        deleteTodoId = null;
    }
}

// Confirm Delete Handler
document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
    if (!deleteTodoId) return;

    const confirmBtn = this;
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';

    fetch(`/todos/${deleteTodoId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to delete task');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            closeConfirmModal();
            removeTodoFromDOM(deleteTodoId);
            updateStatistics();
            showToast('Task deleted successfully!', 'success');
        } else {
            showToast(data.error || 'Failed to delete task', 'error');
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<span class="btn-icon" aria-hidden="true">🗑</span><span class="btn-text">Yes, Delete</span>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast(error.message || 'An error occurred while deleting the task', 'error');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Yes, Delete';
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const confirmModal = document.getElementById('confirmModal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditModal();
        closeConfirmModal();
    }
});

// Prevent form submission on Enter if input is empty
document.getElementById('taskInput')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim() === '') {
        e.preventDefault();
        showToast('Please enter a task before adding!', 'error');
    }
});

// Add success message fade on page load
document.addEventListener('DOMContentLoaded', function() {
    const successAlert = document.querySelector('.alert-success');
    if (successAlert) {
        setTimeout(() => {
            successAlert.style.opacity = '0';
            setTimeout(() => successAlert.remove(), 300);
        }, 3000);
    }

    // Handle checkbox clicks to toggle completion
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const todoId = this.getAttribute('data-todo-id');
            toggleTodoCompletion(todoId, this.checked);
        });
    });

    // Update statistics on page load
    updateStatistics();
    
    // Setup new features
    setupSearch();
    setupSort();
    setupClearCompleted();
    setupKeyboardShortcuts();
    setupExport();
    setupDragAndDrop();
});

// Toggle todo completion status
function toggleTodoCompletion(todoId, isChecked) {
    const checkbox = document.querySelector(`#check-${todoId}`);
    const todoItem = checkbox?.closest('.todo-item');
    
    if (!checkbox || !todoItem) return;

    // Optimistically update UI
    if (isChecked) {
        todoItem.classList.add('completed');
    } else {
        todoItem.classList.remove('completed');
    }

    // Send request to server
    fetch(`/todos/${todoId}/toggle`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to toggle task');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Update statistics by adjusting counts
            const completedEl = document.querySelector('#completedTasks');
            const pendingEl = document.querySelector('#pendingTasks');
            
            if (data.todo.completed) {
                // Task was marked as completed
                if (completedEl) {
                    const current = parseInt(completedEl.textContent) || 0;
                    completedEl.textContent = current + 1;
                    completedEl.style.transform = 'scale(1.1)';
                    setTimeout(() => completedEl.style.transform = 'scale(1)', 200);
                }
                if (pendingEl) {
                    const current = parseInt(pendingEl.textContent) || 0;
                    pendingEl.textContent = Math.max(0, current - 1);
                    pendingEl.style.transform = 'scale(1.1)';
                    setTimeout(() => pendingEl.style.transform = 'scale(1)', 200);
                }
            } else {
                // Task was marked as pending
                if (completedEl) {
                    const current = parseInt(completedEl.textContent) || 0;
                    completedEl.textContent = Math.max(0, current - 1);
                    completedEl.style.transform = 'scale(1.1)';
                    setTimeout(() => completedEl.style.transform = 'scale(1)', 200);
                }
                if (pendingEl) {
                    const current = parseInt(pendingEl.textContent) || 0;
                    pendingEl.textContent = current + 1;
                    pendingEl.style.transform = 'scale(1.1)';
                    setTimeout(() => pendingEl.style.transform = 'scale(1)', 200);
                }
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Revert checkbox state on error
        checkbox.checked = !isChecked;
        if (isChecked) {
            todoItem.classList.remove('completed');
        } else {
            todoItem.classList.add('completed');
        }
        showToast(error.message || 'An error occurred while updating the task', 'error');
    });
}

// Update statistics
function updateStatistics() {
    // Count from DOM - more efficient than fetching the page
    const completed = document.querySelectorAll('.todo-item.completed').length;
    const total = document.querySelectorAll('.todo-item').length;
    const pending = total - completed;
    
    const completedEl = document.querySelector('#completedTasks');
    const pendingEl = document.querySelector('#pendingTasks');
    const totalEl = document.querySelector('#totalTasks');
    const completionPercentageEl = document.querySelector('#completionPercentage');
    const progressFill = document.querySelector('.progress-fill');
    
    if (completedEl) {
        completedEl.textContent = completed;
        // Add animation
        completedEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            completedEl.style.transform = 'scale(1)';
        }, 200);
    }
    if (pendingEl) {
        pendingEl.textContent = pending;
        // Add animation
        pendingEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            pendingEl.style.transform = 'scale(1)';
        }, 200);
    }
    if (totalEl) {
        totalEl.textContent = total;
    }
    
    // Update completion percentage and progress bar
    if (total > 0 && completionPercentageEl) {
        const percentage = Math.round((completed / total) * 100);
        completionPercentageEl.textContent = percentage + '%';
    }
    
    if (total > 0 && progressFill) {
        const percentage = (completed / total) * 100;
        progressFill.style.width = percentage + '%';
    }
    
    // Update clear completed count
    const completedCountForClear = document.getElementById('completedCountForClear');
    if (completedCountForClear) {
        completedCountForClear.textContent = completed;
        
        // Hide clear button if no completed tasks
        const clearCompletedBtn = document.getElementById('clearCompletedBtn');
        const clearWrapper = clearCompletedBtn?.closest('.clear-completed-wrapper');
        if (completed === 0 && clearWrapper) {
            clearWrapper.style.display = 'none';
        } else if (completed > 0 && clearWrapper) {
            clearWrapper.style.display = 'flex';
        }
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const todoList = document.getElementById('todoList');
    
    if (!searchInput || !todoList) return;
    
    const todoItems = document.querySelectorAll('.todo-item');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (searchTerm) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
        
        // Filter todos
        let visibleCount = 0;
        todoItems.forEach(item => {
            const taskText = item.querySelector('.todo-task')?.textContent.toLowerCase() || '';
            if (taskText.includes(searchTerm)) {
                item.style.display = '';
                item.style.animation = 'fadeIn 0.3s ease';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update task count badge
        const taskCountBadge = document.getElementById('taskCount');
        if (taskCountBadge) {
            taskCountBadge.textContent = visibleCount;
        }
        
        // Show/hide empty state for search
        const existingEmptyState = todoList.querySelector('.empty-state');
        if (searchTerm && visibleCount === 0 && !existingEmptyState) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon" aria-hidden="true">🔍</div>
                <p class="empty-title">No tasks found</p>
                <p class="empty-message">Your search "${searchInput.value}" didn't match any tasks.</p>
            `;
            todoList.appendChild(emptyState);
        } else if ((!searchTerm || visibleCount > 0) && existingEmptyState && !existingEmptyState.previousElementSibling) {
            existingEmptyState.remove();
        }
    });
    
    // Clear search
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        todoItems.forEach(item => {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.3s ease';
        });
        const taskCountBadge = document.getElementById('taskCount');
        if (taskCountBadge) {
            const totalTasks = todoItems.length;
            taskCountBadge.textContent = totalTasks;
        }
        
        // Remove search empty state if present
        const existingEmptyState = todoList.querySelector('.empty-state');
        if (existingEmptyState && !todoList.querySelector('.todo-item')) {
            existingEmptyState.remove();
        }
        
        searchInput.focus();
    });
    
    // Keyboard shortcut: Ctrl+F or Cmd+F to focus search
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Sort functionality
function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('sort', this.value);
        window.location.href = currentUrl.toString();
    });
}

// Clear completed functionality
function setupClearCompleted() {
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    
    if (!clearCompletedBtn) return;
    
    clearCompletedBtn.addEventListener('click', function() {
        if (!confirm('Are you sure you want to delete all completed tasks? This action cannot be undone.')) {
            return;
        }
        
        const btn = this;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Clearing...</span>';
        
        fetch('/todos/clear/completed', {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to clear completed tasks');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Remove all completed tasks from DOM
                const completedItems = document.querySelectorAll('.todo-item.completed');
                let removedCount = 0;
                
                completedItems.forEach((item, index) => {
                    setTimeout(() => {
                        removeTodoFromDOM(item.getAttribute('data-id'));
                        removedCount++;
                        if (removedCount === completedItems.length) {
                            updateStatistics();
                        }
                    }, index * 50); // Stagger animations
                });
                
                showToast(`Successfully deleted ${data.deletedCount} completed task(s)!`, 'success');
            } else {
                throw new Error('Failed to clear completed tasks');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast(error.message || 'An error occurred while clearing completed tasks', 'error');
            btn.disabled = false;
            btn.innerHTML = originalText;
        });
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only trigger shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow Escape to close modals even when in input
            if (e.key === 'Escape') {
                closeEditModal();
                closeConfirmModal();
            }
            return;
        }
        
        // N - Focus on new task input
        if (e.key === 'n' || e.key === 'N') {
            const taskInput = document.getElementById('taskInput');
            if (taskInput) {
                e.preventDefault();
                taskInput.focus();
            }
        }
        
        // S - Focus on search
        if (e.key === 's' || e.key === 'S') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
        
        // / - Focus on search (alternative)
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
}

// Export functionality
function setupExport() {
    const exportBtn = document.getElementById('exportBtn');
    
    if (!exportBtn) return;
    
    exportBtn.addEventListener('click', function() {
        const btn = this;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Exporting...</span>';
        
        fetch('/todos/export')
            .then(async response => {
                const contentType = response.headers.get('content-type');
                
                if (!response.ok) {
                    // Try to parse as JSON if it's JSON, otherwise use text
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            const data = await response.json();
                            throw new Error(data.error || 'Failed to export todos');
                        } catch (e) {
                            throw new Error('Failed to export todos');
                        }
                    } else {
                        // Get text error message
                        const text = await response.text();
                        throw new Error(text || 'Failed to export todos');
                    }
                }
                
                // Check if response is JSON before processing
                if (contentType && contentType.includes('application/json')) {
                    return response.text();
                } else {
                    throw new Error('Invalid response format from server');
                }
            })
            .then(text => {
                // Validate that it's valid JSON
                try {
                    JSON.parse(text);
                } catch (e) {
                    throw new Error('Invalid JSON data received from server');
                }
                
                // Create blob from text
                const blob = new Blob([text], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    if (document.body.contains(a)) {
                        document.body.removeChild(a);
                    }
                }, 100);
                
                showToast('Todos exported successfully!', 'success');
            })
            .catch(error => {
                console.error('Export Error:', error);
                showToast(error.message || 'Failed to export todos', 'error');
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
            });
    });
}

// Drag and Drop functionality
function setupDragAndDrop() {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;
    
    let draggedElement = null;
    let placeholder = null;
    
    // Create placeholder element
    function createPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.innerHTML = '<div class="placeholder-content">Drop here</div>';
        return placeholder;
    }
    
    // Handle drag start
    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('draggable') || e.target.closest('.draggable')) {
            const todoItem = e.target.closest('.draggable') || e.target;
            draggedElement = todoItem;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', todoItem.innerHTML);
            todoItem.classList.add('dragging');
            
            placeholder = createPlaceholder();
            placeholder.style.height = todoItem.offsetHeight + 'px';
            todoItem.parentNode.insertBefore(placeholder, todoItem);
        }
    });
    
    // Handle drag over
    document.addEventListener('dragover', function(e) {
        if (e.target.classList.contains('draggable') || e.target.closest('.todo-item')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const todoItem = e.target.closest('.todo-item') || e.target;
            if (todoItem && draggedElement && todoItem !== draggedElement && todoItem.classList.contains('draggable')) {
                const rect = todoItem.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    todoItem.parentNode.insertBefore(placeholder, todoItem);
                } else {
                    todoItem.parentNode.insertBefore(placeholder, todoItem.nextSibling);
                }
            }
        }
    });
    
    // Handle drag end
    document.addEventListener('dragend', function(e) {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            draggedElement = null;
            placeholder = null;
        }
    });
    
    // Handle drop
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (!draggedElement || !placeholder) return;
        
        const todoList = document.getElementById('todoList');
        const todoItems = Array.from(todoList.querySelectorAll('.todo-item'));
        
        // Get the new order
        const newOrder = todoItems.map(item => item.getAttribute('data-id'));
        
        // Insert dragged element at placeholder position
        placeholder.parentNode.replaceChild(draggedElement, placeholder);
        
        // Get the updated order after DOM change
        const updatedOrder = Array.from(todoList.querySelectorAll('.todo-item')).map(item => item.getAttribute('data-id'));
        
        // Send reorder request
        fetch('/todos/reorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todoIds: updatedOrder })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to reorder todos');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showToast('Tasks reordered successfully!', 'success');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to reorder tasks', 'error');
            // Optionally reload page to restore original order on error
            // window.location.reload();
        });
        
        draggedElement = null;
        placeholder = null;
    });
}

// Toast notification system (improved alert)
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        closeToast(toast);
    });
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        closeToast(toast);
    }, 4000);
}

function closeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

// Update todo item in DOM without reload
function updateTodoInDOM(updatedTodo) {
    const todoItem = document.querySelector(`.todo-item[data-id="${updatedTodo.id}"]`);
    if (!todoItem) return;
    
    // Update task text
    const taskElement = todoItem.querySelector('.todo-task');
    if (taskElement) {
        taskElement.textContent = updatedTodo.task;
    }
    
    // Update priority
    const priorityBadge = todoItem.querySelector('.priority-badge');
    if (priorityBadge) {
        const priorityIcon = priorityBadge.querySelector('.priority-icon');
        const priorityText = priorityBadge.querySelector('.priority-text');
        
        // Remove old priority classes
        todoItem.classList.remove('priority-low', 'priority-medium', 'priority-high');
        priorityBadge.classList.remove('priority-low', 'priority-medium', 'priority-high');
        
        // Add new priority classes
        todoItem.classList.add(`priority-${updatedTodo.priority}`);
        priorityBadge.classList.add(`priority-${updatedTodo.priority}`);
        priorityText.textContent = updatedTodo.priority;
        
        // Update icon
        if (priorityIcon) {
            const icons = { high: '🔴', medium: '🟡', low: '🔵' };
            priorityIcon.textContent = icons[updatedTodo.priority] || '🟡';
        }
    }
    
    // Update completion status
    const checkbox = todoItem.querySelector('.todo-checkbox');
    if (checkbox) {
        checkbox.checked = updatedTodo.completed || false;
    }
    
    // Update completed class
    if (updatedTodo.completed) {
        todoItem.classList.add('completed');
    } else {
        todoItem.classList.remove('completed');
    }
    
    // Update edit button data attributes
    const editButton = todoItem.querySelector('.btn-edit');
    if (editButton) {
        editButton.setAttribute('data-edit-task', updatedTodo.task.replace(/"/g, '&quot;').replace(/\n/g, ' '));
        editButton.setAttribute('data-edit-priority', updatedTodo.priority);
    }
    
    // Add update animation
    todoItem.style.animation = 'none';
    setTimeout(() => {
        todoItem.style.animation = 'updatePulse 0.5s ease';
    }, 10);
}

// Remove todo item from DOM with animation
function removeTodoFromDOM(todoId) {
    const todoItem = document.querySelector(`.todo-item[data-id="${todoId}"]`);
    if (!todoItem) return;
    
    // Animate out
    todoItem.style.animation = 'fadeOut 0.3s ease';
    todoItem.style.opacity = '0';
    todoItem.style.transform = 'translateX(-50px)';
    
    setTimeout(() => {
        todoItem.remove();
        
        // Check if list is now empty and show empty state
        const todoList = document.getElementById('todoList');
        const remainingItems = todoList.querySelectorAll('.todo-item');
        
        if (remainingItems.length === 0) {
            // Check if there's already an empty state
            if (!todoList.querySelector('.empty-state')) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <div class="empty-icon" aria-hidden="true">📝</div>
                    <p class="empty-title">No tasks found</p>
                    <p class="empty-message">Add a new task to get started!</p>
                `;
                todoList.appendChild(emptyState);
            }
        }
        
        // Update task count
        const taskCount = document.getElementById('taskCount');
        if (taskCount) {
            taskCount.textContent = remainingItems.length;
        }
    }, 300);
}

// Refresh page manually (optional refresh button)
function refreshPage() {
    // Show loading state
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        const originalHtml = refreshBtn.innerHTML;
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Refreshing...</span>';
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    } else {
        window.location.reload();
    }
}

