import React from "react";
import API from "../../utils/API";
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import ProfileSnippet from '../ProfileSnippet';

jest.mock('../../utils/API');

const deleteButton = () => screen.getByTestId("delete-button");
const viewButton = () => screen.getByTestId("editor-button");

it('accepts any props passed to it', () => {
  const snippet = { _id: "a mongoDB id", mode: "a programming language", body: ["array of strings"], lastEdited: Date.now() }
  const testid = "snippet";
  render(
    <ProfileSnippet snippet={snippet} data-testid={testid} data-testing="true" />,
  );

  expect(screen.getByTestId(testid)).toHaveAttribute("data-testing");
});

it('Shows a delete button', () => {
  const snippet = { _id: "1", mode: "2", body: ["3"], lastEdited: Date.now() }
  render(
    <ProfileSnippet snippet={snippet} />,
  );

  expect(deleteButton()).toBeInTheDocument();
});

it('Disables delete button if "viewer is not owner"', () => {
  const snippet = { _id: "1", mode: "2", body: ["3"], lastEdited: Date.now() }
  render(
    <ProfileSnippet snippet={snippet} viewerIsOwner={false} />,
  );
  const button = deleteButton();
  expect(button).toBeInTheDocument();

  expect(button).toBeDisabled();
});

it('Enables delete button if "viewer is owner"', () => {
  const snippet = { _id: "1", mode: "2", body: ["3"], lastEdited: Date.now() }
  render(
    <ProfileSnippet snippet={snippet} viewerIsOwner={true} />,
  );
  const button = deleteButton();
  expect(button).toBeInTheDocument();

  expect(button).toBeEnabled();
});

it('Hides snippet when delete button is clicked', () => {
  const snippet = { _id: "1", mode: "2", body: ["3"], lastEdited: Date.now() }
  render(
    <ProfileSnippet snippet={snippet} viewerIsOwner={true} data-testid="snippet" />,
  );

  const snippetElement = screen.getByTestId("snippet");
  expect(snippetElement).toBeInTheDocument();

  act(() => {
    fireEvent.click(deleteButton());
  });

  expect(snippetElement).not.toBeInTheDocument();
});

it('Doesn\'t hide snippet when delete button is disabled', () => {
  const snippet = { _id: "1", mode: "2", body: ["3"], lastEdited: Date.now() }
  render(
    <ProfileSnippet snippet={snippet} viewerIsOwner={false} data-testid="snippet" />,
  );

  const snippetElement = screen.getByTestId("snippet");
  expect(snippetElement).toBeInTheDocument();

  act(() => {
    fireEvent.click(deleteButton());
  });

  expect(snippetElement).toBeInTheDocument();
});

it('Calls the API.deleteCodeById function, with the snippet id, when delete button is clicked', () => {
  API.deleteCodeById.mockReset();
  API.deleteCodeById.mockResolvedValue(true);

  const snippet = { _id: "a mongoDB id", mode: "2", body: ["3"], lastEdited: Date.now() }
  render(
    <ProfileSnippet snippet={snippet} viewerIsOwner={true} data-testid="snippet" />,
  );

  const snippetElement = screen.getByTestId("snippet");
  expect(snippetElement).toBeInTheDocument();

  act(() => {
    fireEvent.click(deleteButton());
  });

  // checking the first argument passed to the deleteCodeById function
  expect(API.deleteCodeById.mock.calls[0][0]).toEqual(snippet._id);
});

it('Shows a button to go which links to the editor as "/editor/{mode}/{id}"', () => {
  const snippet = { _id: "1", mode: "2", body: ["3"], lastEdited: Date.now() }
  render(
    <ProfileSnippet snippet={snippet} data-testid="snippet" />,
  );
  
  const button = viewButton();

  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute("href", "/editor/" + snippet.mode + "/" + snippet._id);
});
