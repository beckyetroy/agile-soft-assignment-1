
import { filterByGenre, filterByTitle, filterByName } from "../support/e2e";

let movies; // List of Discover movies from TMDB
let actors // List of popular actors from TMDB
describe("Filtering", () => {
  before(() => {
    // Get movies from TMDB and store them locally.
    cy.request(
      `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&include_adult=false&include_video=false&page=1`
    )
      .its("body")
      .then((response) => {
        movies = response.results;
      });
    
  });
  beforeEach(() => {
    cy.visit("/movies/home");
  });

  describe("By movie title", () => {
    it("only display movies with 'm' in the title", () => {
      const searchString = "m";
      const matchingMovies = filterByTitle(movies, searchString);
      cy.get("#filled-search").clear().type(searchString); // Enter m in text box
      cy.get(".MuiCardHeader-content").should(
        "have.length",
        matchingMovies.length
      );
      cy.get(".MuiCardHeader-content").each(($card, index) => {
        cy.wrap($card).find("p").contains(matchingMovies[index].title);
      });
    });
    it("handles case when there are no matches", () => {
      const searchString = "xyxxzyyzz";
      cy.get("#filled-search").clear().type(searchString); // Enter m in text box
      cy.get(".MuiCardHeader-content").should("have.length", 0);
    });
  });
  describe("By movie genre", () => {
    it("show movies with the selected genre", () => {
      const selectedGenreId = 35;
      const selectedGenreText = "Comedy";
      const matchingMovies = filterByGenre(movies, selectedGenreId);
      cy.get("#genre-select").click();
      cy.get("li").contains(selectedGenreText).click();
      cy.get(".MuiCardHeader-content").should(
        "have.length",
        matchingMovies.length
      );
      cy.get(".MuiCardHeader-content").each(($card, index) => {
        cy.wrap($card).find("p").contains(matchingMovies[index].title);
      });
    });
    describe("Combined genre and title", () => {
        it("show movies with the selected genre and searched title", () => {
            const selectedGenreId = 28;
            const selectedGenreText = "Action";
            const matchingMoviesGenre = filterByGenre(movies, selectedGenreId);
            const searchString = "adam";
            const matchingMoviesTitle = filterByTitle(movies, searchString);
            cy.get("#genre-select").click();
            cy.get("li").contains(selectedGenreText).click();
            cy.get(".MuiCardHeader-content").should(
              "have.length",
              matchingMoviesGenre.length
            );
            cy.get("#filled-search").clear().type(searchString); // Enter  in text box
            cy.get(".MuiCardHeader-content").should(
                "have.length",
                matchingMoviesTitle.length
            );
            cy.get(".MuiCardHeader-content").each(($card, index) => {
                cy.wrap($card).find("p").contains(matchingMoviesTitle[index].title);
            });
        });
        it("handles case when there are no matches", () => {
            const searchString = "xyxxzyyzz";
            cy.get("#filled-search").clear().type(searchString); 
            cy.get(".MuiCardHeader-content").should("have.length", 0);
          });
    });
    describe("Popular actors page", () => {
        describe("Searching for actors by name", ()=> {
            beforeEach(()=>{
                //Requests list of popular actors
                cy.request(
                    `https://api.themoviedb.org/3/person/popular?api_key=${Cypress.env(
                        "TMDB_KEY"
                    )}&language=en-US&page=1`
                )
                    .its("body") // Take the body of HTTP response from TMDB
                    .then((response) => {
                        actors = response.results;
                    });
                cy.visit("/people")
            })
            it("only display trending actors with 'e' in their name", () => {
                const searchString = "e";
                const matchingActors = filterByName(actors, searchString);
                cy.get("#filled-search").clear().type(searchString); // Enter e in text box
                cy.get(".MuiCardHeader-content").should(
                  "have.length",
                  matchingActors.length
                );
                cy.get(".MuiCardHeader-content").each(($card, index) => {
                  cy.wrap($card).find("p").contains(matchingActors[index].name);
                });
              });
              it("handles case when there are no matches", () => {
                const searchString = "xyxxzyyzz";
                cy.get("#filled-search").clear().type(searchString); // Enter m in text box
                cy.get(".MuiCardHeader-content").should("have.length", 0);
              });
            });
    });
  });
});