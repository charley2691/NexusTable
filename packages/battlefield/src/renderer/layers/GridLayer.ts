import { Grid } from "../../grid/Grid";
import { GridRenderer } from "../../grid/GridRenderer";
import { Layer } from "./Layer";

export class GridLayer extends Layer {

    render(grid: Grid): void {

        this.clear();

        const renderer =
            new GridRenderer(grid);

        this.container.addChild(
            renderer.render()
        );
    }

}