describe('Happy Path', () => {
  // Use a unique email each run so registration always works
  const email = `test${Date.now()}@test.com`;
  const password = 'password123';
  const name = 'Test User';

  it('registers successfully', () => {
    cy.visit('/register');
    cy.get('input[placeholder="Name"]').type(name);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('input[placeholder="Confirm Password"]').type(password);
    cy.contains('button', 'Register').click();
    cy.url().should('include', '/dashboard');
  });

  it('creates a new presentation successfully', () => {
    cy.visit('/dashboard');
    cy.contains('button', '+ New Presentation').click();
    cy.get('input[placeholder="Name *"]').type('My Test Presentation');
    cy.contains('button', 'Create').click();
    cy.contains('My Test Presentation').should('exist');
  });

  it('updates the thumbnail and name of the presentation successfully', () => {
    cy.visit('/dashboard');
    cy.contains('My Test Presentation').click();
    cy.url().should('include', '/presentation/');
    // Click the title to open edit modal
    cy.contains('My Test Presentation').click();
    cy.get('input[placeholder="Presentation name *"]').clear().type('Updated Presentation');
    cy.get('input[placeholder="Thumbnail URL (optional)"]').type('https://picsum.photos/200');
    cy.contains('button', 'Save').click();
    cy.contains('Updated Presentation').should('exist');
  });

  it('adds some slides successfully', () => {
    cy.visit('/dashboard');
    cy.contains('Updated Presentation').click();
    cy.url().should('include', '/presentation/');
    // Add 2 more slides
    cy.contains('button', '+').click();
    cy.wait(500);
    cy.contains('button', '+').click();
    cy.wait(500);
    // Should now show slide 3
    cy.contains('3').should('exist');
  });

  it('switches between slides successfully', () => {
    cy.visit('/dashboard');
    cy.contains('Updated Presentation').click();
    cy.url().should('include', '/presentation/');
    // Go to next slide
    cy.contains('button', '›').click();
    cy.wait(500);
    // Go back
    cy.contains('button', '‹').click();
    cy.wait(500);
    cy.contains('1').should('exist');
  });

  it('deletes a presentation successfully', () => {
    cy.visit('/dashboard');
    cy.contains('Updated Presentation').click();
    cy.url().should('include', '/presentation/');
    cy.contains('button', 'Delete Presentation').click();
    cy.contains('button', 'Yes').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Updated Presentation').should('not.exist');
  });

  it('logs out successfully', () => {
    cy.visit('/dashboard');
    cy.contains('button', 'Logout').click();
    cy.url().should('include', '/');
  });

  it('logs back in successfully', () => {
    cy.visit('/login');
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/dashboard');
  });
});