# Mermaid Sequence Diagram for an Order

sequenceDiagram
participant Client as User Browser
participant API as E-commerce API
participant OrderController as Order Controller
participant OrderService as Order Service
participant Prisma as Prisma Client
participant DB as PostgreSQL Database

    Client->>+API: POST /orders
    activate API
    Note right of API: User sends new order data (product_id, quantity)

    API->>OrderController: CreateOrder(data)
    activate OrderController
    Note left of OrderController: Validates input data

    OrderController->>+OrderService: CreateOrder(data)
    activate OrderService

    Note over OrderService,Prisma: Business logic to calculate total price & check stock
    OrderService->>Prisma: findUnique(Product, data.product_id)
    activate Prisma
    Prisma-->>-OrderService: Return Product details

    Note right of OrderService: Checks if enough stock is available
    alt Stock is available
        OrderService->>Prisma: create(Order, { ...data, total_price, status: 'pending' })
        activate Prisma
        Prisma-->>-OrderService: Return new Order

        OrderService->>Prisma: update(Product, { id: product_id, data: { stock_quantity: new_quantity } })
        activate Prisma
        Prisma-->>-OrderService: Return updated Product

    else Not enough stock
        OrderService-->>-OrderController: Throws 'Insufficient Stock' error
    end

    OrderService-->>-OrderController: Return new Order details
    deactivate OrderService

    OrderController-->>-API: HTTP 201 Created
    deactivate OrderController

    API-->>-Client: Order created successfully
    deactivate API

    Note over Client,DB: The entire process ensures atomicity by updating both Order and Product.
