import { MESSAGE_TEXT_BUBBLE_ID } from '../constants'

describe('Essay Chat Functionality', () => {
  beforeEach(() => {
    cy.visit(`/shortcuts/user/basic-and-unlock-doc/10/`, {
      headers: {
        'ch-force-bucket-doc-exp-unlocked-document-question-chat': '0',
        'ch-use-document-question-chat': '0',
        'ch-use-document-paper-chat': '1',
        'ch-use-unlocked-tour': '0',
      },
    })
    cy.viewport(1441, 1800) // makes the screen tall enough to see all available components
  })

  context('Initial Load', () => {
    it('should display the Course Assistant container on page load', () => {
      cy.get('#document-chat-panel')
    })

    context('Document Summary and Similar Papers', () => {
      it('should summarize the document', () => {
        cy.intercept({
          method: 'GET',
          url: '/api/v1/documents/*/prompts**',
        }).as('essaySummarizer')
        cy.findByRole('button', { name: 'Summarize this document' }).click()
        cy.get('@essaySummarizer')
          .its('request.url')
          .should('contain', 'summarize')
      })

      it('should display similar papers', () => {
        cy.findByRole('button', { name: 'Summarize this document' }).click()
        cy.findByRole('button', {
          name: 'Find related sources from Google Scholar',
        })
          .should('be.visible')
          .click()
        cy.get(`[data-testid=${MESSAGE_TEXT_BUBBLE_ID}]`).should(
          'contain.text',
          'Google Scholar',
        )
      })
    })

    context('Essay Chat Response Scenarios', () => {
      it('should receive a response when clicking on a pill', () => {
        const pillText = 'Generate an outline'
        cy.contains(pillText).click()
        cy.get('#chat-messages-container')
          .contains(
            'Great! Enter your prompt below, or use the same topic from this paper.',
          )
          .should('be.visible')
      })
      it('should receive a response when typing a message', () => {
        const userMessage = 'Can you provide more information?'
        cy.get('textarea[name="chatinput"]').click().type(userMessage)
        cy.get('textarea[name="chatinput"]').type('{enter}')
        cy.get('#chat-messages-container').should('be.visible')
      })
    })
  })
})
