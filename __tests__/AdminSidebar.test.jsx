import { render } from "@testing-library/react"
import AdminSidebar from "../components/AdminSidebar"

describe('AdminSidebar', () => {
    it('Tests if component renders', async () => {
        const test = render (<AdminSidebar CurrentPage="Dashboard"/>);
        render (<AdminSidebar CurrentPage="Orders"/>);
        render (<AdminSidebar CurrentPage="Products"/>);
        render (<AdminSidebar CurrentPage="Users"/>);

        await test.findAllByText("Dashboard").then((result) => {
            expect(result.length).toBe(4);
        });
        await test.findAllByText("Orders").then((result) => {
            expect(result.length).toBe(4);
        });
        await test.findAllByText("Products").then((result) => {
            expect(result.length).toBe(4);
        });
        await test.findAllByText("Users").then((result) => {
            expect(result.length).toBe(4);
        });
    })
  })