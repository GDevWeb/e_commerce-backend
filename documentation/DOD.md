# Definition of Done (DoD)

A task or feature is considered "done" when **all** of the following criteria have been met:

1.  **Code Completion:**

    - The feature's business logic has been fully implemented (e.g., the service, controller, and routes are created).
    - The code is clean, well-formatted, and follows the project's established coding conventions.

2.  **Functionality and Testing:**

    - The feature has been tested locally and works as expected.
    - All necessary **unit tests** for the new code have been written and **pass successfully**.
    - (For Session 5 and 6) New **integration tests** have been written to ensure the new feature interacts correctly with existing modules, and all tests pass.

3.  **Error and Edge Case Handling:**

    - Error handling for all expected scenarios is implemented.
    - Data input validation is in place where necessary (e.g., for new user creation).

4.  **Security (for relevant tasks):**

    - Authentication is implemented to protect routes (for the `Authentication` and subsequent modules).
    - Authorization (RBAC) is implemented to restrict access as required.

5.  **Documentation:**

    - The codebase is adequately commented, especially for complex functions or business logic.
    - (For the final session) The API endpoints are documented using a tool like Swagger.

6.  **Version Control:**
    - The changes have been committed with a clear, descriptive commit message.
    - The changes have been pushed to the remote Git repository.

---

### Example: DoD for the `Users` Module (Session 4)

To complete the `Users` module, you must have:

- **Code:** The services, controllers, and routes for all CRUD operations (Create, Read, Update, Delete) are implemented.
- **Validation:** All data input fields for user creation and update are validated.
- **Tests:** Unit tests for all service and controller functions are written and pass.
- **Version Control:** The code is committed and pushed to the repository.
